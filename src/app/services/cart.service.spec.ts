import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should add items to cart', () => {
    const item = { title: 'Studio A', date: '2025-07-10' };
    service.addToCart(item);
    expect(service.getCartItems().length).toBe(1);
  });

  it('should clear the cart', () => {
    service.addToCart({ title: 'Studio A', date: '2025-07-10' });
    service.clearCart();
    expect(service.getCartItems().length).toBe(0);
  });
});
