
// This are the known broken legacy links
const routesDictionary = [
  {
    old: '#?mpb=topografie&mpz=8&mpfs=T&mpo=exvg::T:exin::T:exuo::T&mpv=52.3733262:4.8934106&pgn=home',
    new: '/kaart?lagen=ZXh2ZzoxfGV4aW46MXxleHVvOjE%3D&lat=52.3787158140549&lng=4.893662070270319&zoom=8'
  },
  {
    old: '#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T',
    new: '/kaart'
  }
];

const resolveLegacyRoutes = () => {
  if (window.location.hash.match(/#\?/g)) {
    const routePath = routesDictionary.filter((r) => r.old === window.location.hash);
    window.location = routePath.length && routePath[0].new ? routePath[0].new : '/oldversion';
  }
};

export default resolveLegacyRoutes;
