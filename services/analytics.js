import ReactGA from 'react-ga'
export const initGA = () => {
  console.log('GA init')
  ReactGA.initialize('UA-146092098-1')
}
export const logPageView = () => {
  const url = window.location.pathname + window.location.search;
  console.log(`Logging pageview for ${url}`)
  ReactGA.set({ page: url })
  ReactGA.pageview(url)
}
export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action })
  }
}
export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}