import Vue from 'vue'
import Vuex from 'vuex'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
	state: { // = data
		products:[],
		cart: []
	},

	getters: { // = the same thing with vue <computed> properties

		availableProducts(state, getters) {
		 	return state.products.filter(product => product.inventory > 0)		
		},

		cartProducts(state) {
			return state.cart.map(cartItem => {

				const product = state.products.find(product => product.id === cartItem.id)

				return {
					title: product.title,
					price: product.price,
					quantity: cartItem.quantity
				}
			})
		},

		cartTotal(state, getters) {
			let total = 0;

			getters.cartProducts.forEach(product => {
				total += product.price * product.quantity
			})

			return total

			return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
		}
	},

	actions: { // = the same thing with vue <methods> properties
		fetchProducts({commit}) {
			return new Promise((resolve, reject) => {
				shop.getProducts(products => {
					commit('setProducts', products)
					resolve()
				})	
			})				
		},

		addProductToCart(context, product) {
			if (product.inventory > 0) {
				const cartItem = context.state.cart.find(item => item.id === product.id)
				if(!cartItem) {
					context.commit('pushProductToCart', product.id)
				} else {
					context.commit('incrementItemQuantity', cartItem)
				}

				context.commit('decrementProductInventory', product)
			}
		}
	},

	mutations: { // = mutations is the something new thing. 
		setProducts(state, products) {
			// update products
			state.products = products
		},

		pushProductToCart(state, productId) {
			state.cart.push({
				id: productId,
				quantity: 1
			})
		},

		incrementItemQuantity(state, cartItem) {
			cartItem.quantity++
		},

		decrementProductInventory(state, product) {
			product.inventory--
		}
	}
})	