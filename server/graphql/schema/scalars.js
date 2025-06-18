const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const DateType = new GraphQLScalarType({
  name: "Date",
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

module.exports = { Date: DateType };
