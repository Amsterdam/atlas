import PARAMETERS from '../store/parameters'
import { routing } from './routes'
import { CONTENT_REDIRECT_LINKS } from '../shared/config/config'

const { VIEW, VIEW_CENTER, LAYERS, LEGEND, ZOOM, EMBED } = PARAMETERS

// This are the known broken legacy links
const legacyRoutes = [
  // https://www.parool.nl/amsterdam/kaart-met-onontplofte-bommen-in-amsterdam-nu-openbaar~a4539314/
  {
    from:
      '#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://www.telegraaf.nl/nieuws/1256075/ligt-er-een-bom-uit-woii-in-je-achtertuin-met-deze-kaart-kom-je-er-achter
  {
    from:
      '#?mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '#?ate=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '#?ate=T&lse=T&mpb=topografie&mpz=11&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3815892:4.8626601&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://www.amsterdamsdagblad.nl/gemeente/duizend-bommen-en-granaten-de-bommenkaart
  {
    from:
      '#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '#?ate=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '#?ate=T&lse=T&mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://intranet.alliander.com/blog/${VIEW}/5359847/kaart-met-onontplofte-bommen-in-amsterdam
  {
    from:
      '#?mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  {
    from:
      '?_sp=144b47f5-2817-4a1f-888c-d1d1b69c89cb.1510908859477#?ate=T&mpb=topografie&mpz=14&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3889979:4.9094038&pgn=home',
    to: `${routing.data.path}?${VIEW}=kaart&${VIEW_CENTER}=52.3787158140549%2C4.893662070270319&${EMBED}=true&${LAYERS}=exvg%3A1%7Cexin%3A1%7Cexuo%3A1&${LEGEND}=false&${ZOOM}=8`,
  },
  // https://www.amsterdam.nl/ondernemen/biz/
  {
    from: '#?mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=biz%3A1&${LEGEND}=true&${ZOOM}=9`,
  },
  {
    from: '#?ate=T&mpb=topografie&mpz=9&mpfs=T&mpo=biz::T&mpv=52.3676245:4.8804992&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart&${EMBED}=true&${LAYERS}=biz%3A1&${LEGEND}=true&${ZOOM}=9`,
  },
  // home map
  {
    from: '#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T',
    to: `${routing.data.path}?${VIEW}=kaart`,
  },
]
const shortUrls = [
  {
    from: '/themakaart/taxi',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=oovtig%3A1%7Cvezips%3A1%7Cmzt%3A0%7Cslpb%3A1%7Cslpnb%3A1%7Cbgt%3A1%7Ctar%3A1%7Cpvrts%3A1%7Cpvrll%3A1%7Cpvrpr%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/veiligheid-en-overlast',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=oovorlv%3A1%7Coovoalco%3A1%7Coovctg%3A1%7Coovodlrs%3A1%7Coovoalg%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/logistiek',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=mvw%3A1%7Cmzb%3A1%7Cmzva%3A1%7Cpvrpr%3A0%7Cpvrll%3A1%7Cpvrts%3A0%7Cvrr%3A1&${LEGEND}=true`,
  },
  {
    from: '/themakaart/ondergrond',
    to: `${routing.data.path}?${VIEW}=kaart&${LAYERS}=vezips%3A1%7Cmbgm%3A1%7Cmbs%3A1%7Cmbz%3A1%7Cmbr%3A1%7Cmbaig%3A1%7Cmbgwm%3A1%7Cexin%3A1%7Cmvlpgv%3A1%7Cmvlpga%3A1%7Cmvlpgt%3A1%7Cmvlpgs%3A1%7Cnap%3A1%7Cgbhv%3A1%7Cgbep%3A1%7Cgbgg%3A1%7Cgbgs%3A1%7Cgbos%3A1%7Cgboh%3A1%7Cgbwu%3A1%7Cgbkw%3A1%7Cgbvv%3A1%7Cexvg%3A1%7Cexgg%3A1%7Cexuo%3A1%7Cmvabl%3A1&${LEGEND}=true`,
  },
  {
    from: '/datablog/',
    to: 'https://amsterdam.github.io/datablog/',
  },
]
const articleUrls = CONTENT_REDIRECT_LINKS.ARTICLES.map(item => ({
  from: item.from,
  to: `${routing.articles.path}artikel/${item.to.slug}/${item.to.id[process.env.NODE_ENV]}`,
}))

export const routesDictionary = [...legacyRoutes, ...shortUrls, ...articleUrls]

const resolveRedirects = async () => {
  let routePath = routesDictionary.filter(r => r.from === window.location.pathname)
  if (window.location.hash.match(/#\?/g)) {
    routePath = routesDictionary.filter(r => r.from === window.location.hash)

    return setTimeout(() => {
      window.location.replace(
        routePath.length && routePath[0].to ? routePath[0].to : '/verplaatst/',
      )
      return true
    }, 600) // Tries to prevent cancelling the network request to Matomo from the middleware, arbitrary number that allows Matomo some time to load
  }

  if (routePath.length) {
    return setTimeout(() => {
      window.location.replace(routePath[0].to)
      return true
    }, 600) // Tries to prevent cancelling the network request to Matomo from the middleware, arbitrary number that allows Matomo some time to load
  }

  return false
}

export default resolveRedirects
