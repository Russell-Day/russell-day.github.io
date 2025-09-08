/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: {
                    light: "#f8fafc",
                    dark: "#0b1020",
                },
            },
        },
    },
    plugins: [],
};
