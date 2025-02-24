import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/", // Ensure this is correctly set for your deployment
	build: {
		outDir: "dist",
	},
	server: {
		proxy: {
			"/api": "https://contest-7b07.onrender.com",
		},
	},
});
