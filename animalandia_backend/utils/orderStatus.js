// Lista de estados
export const ORDER_STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    SHIPPED: "SHIPPED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
};

export const getStatusIdByName = async (pool, statusName) => {
    const result = await pool.query(
        "SELECT id FROM order_status WHERE name = $1",
        [statusName]
    );

    if (result.rows.length === 0) {
        throw new Error(`Estado no encontrado: ${statusName}`);
    }

    return result.rows[0].id;
}