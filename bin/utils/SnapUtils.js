

let getChildren = (snap) =>{
  let result = [];
  let val = snap.val();
  for (const valElement in val) {
    result.push(val[valElement]);
  }
  return result;
};

module.exports = {getChildren};
