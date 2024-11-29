export const formatDate = (date) => {
    const options = {month: 'long', day: 'numeric'};
    return date.toLocaleDateString(undefined, options);
};

export const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const formatFullDate = (date) => {
    const formattedDate = new Date(date);
    const day = getOrdinalSuffix(formattedDate.getDate());
    const month = formattedDate.toLocaleString('default', { month: 'short' });
    const weekday = formattedDate.toLocaleString('default', { weekday: 'short' });

    return `${weekday}, ${day} ${month}`;
};

export const getEstimatedDeliveryDate = (orderDate) => {
    const preparationTimeMin = 3;
    const preparationTimeMax = 4;
    const startDate = new Date(orderDate);
    const endDate = new Date(orderDate);

    startDate.setDate(startDate.getDate() + preparationTimeMin);
    endDate.setDate(endDate.getDate() + preparationTimeMax);

    const year = startDate.getFullYear();

    return `${formatDate(startDate)} - ${formatDate(endDate)}, ${year}`;
};

export const orderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
};

// export const monthDay = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric'});
// };
export const monthDay = (dateString) => { 
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).replace(' ', ' - ');
};

export const getStatusClass = (status, order) => {
    if(order.isDelivered) return 'isDelivered';
    if(order.isOutForDelivery) return 'isOutForDelivery';
    if(order.isShipped) return 'isShipped';
    if(order.isConfirmed) return 'isConfirmed';
    return 'pending';
};