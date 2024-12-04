export const createPaymentLink = async (product: {
  name: string;
  price: number;
  id: number;
}) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const baseUrl = window.location.origin;
  const mockPaymentId = Math.random().toString(36).substring(2, 15);
  
  return `${baseUrl}/checkout/${mockPaymentId}?product=${product.id}&amount=${product.price}`;
};