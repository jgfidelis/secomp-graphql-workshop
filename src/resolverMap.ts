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

const orderFormId = "bf9a4f0d64c448e4b1cfedd03b833d83";

const http = async (
  url: string,
  headers: any = {},
  method: string = "GET",
  body?: any
) => {
  const fetchData = await fetch(url, { headers, method, body });
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
  },
  minicart: () => {
    return http(
      `http://boticario.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}?sc=1`
    );
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

const minicartResolvers = {
  Minicart: {
    itemCount: (orderForm: any) => {
      return orderForm.items.length;
    },
    id: (orderForm: any) => orderForm.orderFormId
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
            `http://boticario.vtexcommercestable.com.br/api/catalog_system/pub/category/${id}`
          );
        })
      );
      return categories.map(({ name }) => name);
    },
    firstItem: (product: Product) => product.items[0]
  }
};

const mutations = {
  addItemToCart: (_: any, args: any, ctx: any) => {
    const { itemId } = args;
    const payload = {
      orderItems: [{ id: itemId, quantity: 1, seller: "1" }]
    };
    return http(
      `http://boticario.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}/items?sc=1`,
      { Accept: "application/json", "Content-Type": "application/json" },
      "POST",
      JSON.stringify(payload)
    );
  }
};

const resolverMap: IResolvers = {
  ...productResolvers,
  ...itemResolvers,
  ...minicartResolvers,
  Query: {
    ...queries
  },
  Mutation: {
    ...mutations
  }
};
export default resolverMap;
