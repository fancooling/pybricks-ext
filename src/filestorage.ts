import Dexie, { Table } from 'dexie';

/** Type to avoid mixing UUID with regular string. */
export type UUID = string & { _uuidBrand: undefined };

/**
 * Database metadata table data type.
 *
 * IMPORTANT: if this type is changed, we need to modify the database schema to match
 */
export type FileMetadata = Readonly<{
    /** A globally unique identifier that serves a a file handle. */
    uuid: UUID;
    /** The path of the file in storage. */
    path: string;
    /** The SHA256 hash of the file contents. */
    sha256: string;
    /** The text editor view state. */
    viewState: any;
}>;

/**
 * Database contents table data type.
 *
 * IMPORTANT: if this type is changed, we need to modify the database schema to match
 */
export type FileContents = {
    /** The path of the file in storage. */
    path: string;
    /** The contents of the file. */
    contents: string;
};

export class FileStorageDb extends Dexie {
    metadata!: Table<FileMetadata, UUID>;    
    _contents!: Table<FileContents, string>;

    constructor(databaseName: string) {
        super(databaseName);
        this.version(1).stores({
            metadata: '$$uuid, &path, sha256, viewState',
            _contents: 'path, contents',
        });
    }
}
