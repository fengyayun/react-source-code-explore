import { REACT_ELEMENT, REACT_TEXT } from './ReactSymbol'
/**
 * 把虚拟DOM节点进行包装
 * 如果此虚拟DOM是一个文本，比如说是字符串或者数字，包装成一虚拟DOM节点对象
 * @param {*} element 虚拟DOM
 * @returns 
 */
 export function wrapToVdom(element) {
  return typeof element === 'string' || typeof element === 'number' ? {
      $$typeof: REACT_ELEMENT, type: REACT_TEXT, props: element
  } : element;
}
/**
 * 浅比较两个对象是否相等
 * @param {*} obj1 
 * @param {*} obj2 
 */
export function shallowEqual(obj1,obj2){
  if (obj1 === obj2) return true
  if (typeof obj1 !== 'object' || !obj1 || typeof obj2 !== 'object' || !obj2){
    return false
  }
  let keys1 = Object.keys(obj1)
  let keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length){
    return false
  }
  for (let key of keys1){
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]){
      return false
    }
  }
  return true
}