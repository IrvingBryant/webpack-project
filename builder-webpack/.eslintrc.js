module.exports={
  /*
    表示使用的解析器 默认使用Esprima 
    Babel-ESLint - 一个对Babel解析器的包装，使其能够与 ESLint 兼容
    @typescript-eslint/parser - 将 TypeScript 转换成与 estree 兼容的形式，以便在ESLint中使用。
  */
  "parser": "babel-eslint", 
  "extends":"airbnb-base",
  "env":{
    "browser":true,
    "node":true
  },
  "rules": {
      "semi": "error"
  },
}