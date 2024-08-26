async function pagination(model, page) {

    const ELEMENT_LIMIT = 5;

    const startIndex = (page - 1) * ELEMENT_LIMIT;
    const endIndex = page * ELEMENT_LIMIT;

    const results = {};

    if (endIndex < await model.countDocuments()) {
        results.next = {
            page: page + 1,
            limit: ELEMENT_LIMIT
        };
    }

    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
            limit: ELEMENT_LIMIT
        };
    }

    try {
        results.data = await model.find().sort({_id: -1}).limit(ELEMENT_LIMIT).skip(startIndex);
        results.success = true;
        return results;
    } catch(err) {
        return { success: false, message: 'paginacion: '+err }
    }

} 

module.exports = pagination;