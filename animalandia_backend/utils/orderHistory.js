export const insertOrderStatusHistory = async ({
    client,
    orderId,
    fromStatusId,
    toStatusId,
    userId,
    role,
}) => {
    await client.query(
        `
        INSERT INTO order_status_history
        (order_id, from_status_id, to_status_id, changed_by, changed_by_role)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [orderId, fromStatusId, toStatusId, userId, role]
    );
};