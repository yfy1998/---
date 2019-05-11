function getstarlist(stars) {
  let total = Number(stars.slice(0, 1));
  const starlist = [];
  for (let i = 0; i < 5; i++) {
    if (total > 0) {
      starlist.push(1);
      total--;
    } 
    else starlist.push(0);
  }
  return starlist;
}

function getindex(arr,newsId){
  for(let i=0;i<arr.length;i++){
    if(arr[i].newsId===newsId){
      return i;
    }
  }
  return false;
}

module.exports={
  getstarlist: getstarlist,
  getindex: getindex
}