export function getVisibleProducts(products = []) {
    const visableProducts = products.filter((product) => Boolean(product.productId) || product.reason !== null);
    return visableProducts;
}
