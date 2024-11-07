const isEmail = (value)=>{
    // Regular expression for a basic email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
}
  
const isUsername = (value) => {
    // Simple validation: usernames could be alphanumeric and/or contain underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;  // Example username length between 3-20 characters
    return usernameRegex.test(value);
}

module.exports = {isEmail, isUsername};