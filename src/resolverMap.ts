import { IResolvers } from "graphql-tools";
const fetch = require("node-fetch");
interface ProductArg {
  slug: string;
}

interface Product {
  productId: string;
  productName: string;
  categoriesIds: string[];
  items: any[];
}

const http = async (url: string, headers: any = {}) => {
  const fetchData = await fetch(url, { headers });
  return fetchData.json();
};

const queries = {
  helloWorld(_: void, args: void): string {
    return "Hello world!";
  },
  product: async (_: any, args: ProductArg) => {
    const { slug } = args;
    const results = await http(
      `http://boticario.vtexcommercestable.com.br/api/catalog_system/pub/products/search/${slug}/p`
    );
    return results[0];
  }
};

const itemResolvers = {
  Item: {
    price: (item: any) => {
      return item.sellers[0].commertialOffer.Price;
    },
    imageUrl: (item: any) => {
      return item.images[0].imageUrl;
    }
  }
};

const productResolvers = {
  Product: {
    categoryNames: async (product: Product) => {
      const { categoriesIds } = product;

      //Remove start and trailing /
      const wholeTreeDirty = categoriesIds[0];
      const wholeTreeClean = wholeTreeDirty.slice(1).slice(0, -1);
      const ids = wholeTreeClean.split("/");

      const categories = await Promise.all(
        ids.map((id: string) => {
          return http(
            `http://boticario.vtexcommercestable.com.br/api/catalog_system/pub/category/${id}`,
            { "Content-Type": "application/json" }
          );
        })
      );
      return categories.map(({ name }) => name);
    },
    firstItem: (product: Product) => product.items[0]
  }
};

const resolverMap: IResolvers = {
  ...productResolvers,
  ...itemResolvers,
  Query: {
    ...queries
  }
};
export default resolverMap;
