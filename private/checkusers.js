const checkUsers = (user, userlist) => {
  let templist = `<ul>`;
  if (!userlist.includes(user) && user !== "") {
    userlist.push(user);
  }
  userlist.forEach((element) => {
    templist = templist.concat(`<li>${element}</li>`);
  });
  templist = templist.concat(`</ul>`);

  return templist;
};

module.exports = { checkUsers };
