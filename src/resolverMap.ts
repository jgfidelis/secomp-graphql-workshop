import { IResolvers } from "graphql-tools";
const fetch = require("node-fetch");
interface ProductArg {
  slug: string;
}

const queries = {
  helloWorld(_: void, args: void): string {
    return "Hello world!";
  },
  product: async (_: any, args: ProductArg) => {
    const { slug } = args;
    const fetchData = await fetch(
      `http://boticario.vtexcommercestable.com.br/api/catalog_system/pub/products/search/${slug}/p`
    );
    const results = await fetchData.json();
    return results[0];
  }
};

const productResolvers = {
  Product: {
    teste: () => "hello"
  }
};

const resolverMap: IResolvers = {
  ...productResolvers,
  Query: {
    ...queries
  }
};
export default resolverMap;
