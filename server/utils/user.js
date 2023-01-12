function isAdmin(user) {
    return user && user.roles && user.roles.includes('admin');
}


module.exports = {
    isAdmin,
}