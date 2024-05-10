const cookieOptions = {
  httpOnly: true,
  sameSite: "none",
  // path: "/",
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};


module.exports ={
    cookieOptions
}