// 本地存储模块
// 获取状态值
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  //data可能不是JSON字符串
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

// 改变状态值
export const setItem = (name,value) => {
  if(typeof(value)==='object') {
    value = JSON.stringify(value)
  } 
  window.localStorage.setItem(name,value)
}

//删除状态值
export const removeItem = name => {
  window.localStorage.removeItem(name)
}