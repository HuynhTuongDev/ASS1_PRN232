"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotification } from "@/context/NotificationContext";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { showToast } = useNotification();

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('aura-cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('aura-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = useCallback((product: any) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        showToast(`Đã thêm ${product.name} vào giỏ`, "success");
    }, [showToast]);

    const removeFromCart = useCallback((id: number) => {
        setCart(prevCart => {
            const item = prevCart.find(i => i.id === id);
            if (item) showToast(`Đã xóa ${item.name}`, "info");
            return prevCart.filter(item => item.id !== id);
        });
    }, [showToast]);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        showToast("Đã làm trống giỏ hàng", "info");
    }, [showToast]);

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
