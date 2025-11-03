import app from "./app";

const PORT = process.env.BE_SERVER_PORT || process.env.PORT || 4678;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API endpoints available at:`);
    console.log(`   - GET http://localhost:${PORT}/api/aircraft`);
    console.log(`   - GET http://localhost:${PORT}/api/aircraft/:id`);
});
