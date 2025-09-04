import { fileURLToPath } from 'url';
import { resolve as _resolve, join, dirname } from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
   const isProduction = argv.mode === 'production';

   return {
      entry: {
         content: _resolve(__dirname, "../src/content.ts"),
         filestorage: _resolve(__dirname, "../src/filestorage.ts"),
      },
      output: {
         filename: '[name].js',
         path: _resolve(__dirname, "../dist"),
         clean: true, // Clean the output directory before each build
      },
      devtool: isProduction ? 'source-map' : 'inline-source-map',
      resolve: {
         extensions: ['.tsx', '.ts', '.js'],
      },
      module: {
         rules: [
            {
               test: /\.tsx?$/,
               loader: "ts-loader",
               exclude: /node_modules/,
               options: {
                  compilerOptions: {
                     "noEmit": false // Let ts-loader emit files for webpack
                  }
               }
            },
            {
               test: /\.css$/i,
               use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
         ],
      },
      plugins: [         
         new CopyPlugin({
            patterns: [{from: ".", to: ".", context: "public"}]
         }),
         new MiniCssExtractPlugin({
            filename: 'styles.css',
         }),
      ],      
      devServer: {
         static: join(__dirname, '../dist'),
         compress: true,
         port: 9000,
      },
   };
};
