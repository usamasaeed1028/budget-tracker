module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './node_modules/@your-library/**/*.{js,ts,jsx,tsx}', // Add each library that uses Tailwind
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  