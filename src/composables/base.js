export function useBase() {
  const normalizeDate = (date) => {
    const newDate = new Date(date)
    const day = newDate.getDate().toString().padStart(2, '0')
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0')
    const year = newDate.getFullYear().toString().padStart(4, '0')
    const hour = newDate.getHours().toString().padStart(2, '0')
    const minute = newDate.getMinutes().toString().padStart(2, '0')
    const second = newDate.getSeconds().toString().padStart(2, '0')

    return `${day}.${month}.${year} ${hour}:${minute}:${second}`
  }

  function dateDiff(first, second) {
    first = new Date(first)
    second = new Date(second)
    return Math.round((second - first) / (1000 * 60 * 60 * 24))
  }

  return { normalizeDate, dateDiff }
}
