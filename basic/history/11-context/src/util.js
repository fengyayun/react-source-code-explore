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