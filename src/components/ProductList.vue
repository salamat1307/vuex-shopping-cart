<template>
	<div>
		<h1>Products list</h1>
	
		<img v-if="loading" src="https://i.imgur.com/JfPpwOA.gif" alt="loading">	

		<ul v-else>
			<li v-for="product in products">{{ product.title }} - {{ product.price }} -- {{ product.inventory }}
				<button @click="addProductToCart(product)">Add to Cart</button>			
			</li>
		</ul>
	</div>
</template>	
<script>
	export default {

		data() {
			return {
				loading: false
			}
		},

		computed: {
			products() {
				return this.$store.getters.availableProducts
			}
		},

		methods: {
			addProductToCart(product) {
				this.$store.dispatch('addProductToCart', product)
			}
		},

		created() {
			this.loading = true
			this.$store.dispatch('fetchProducts')
				.then(() => this.loading = false)
		},
	}
</script>