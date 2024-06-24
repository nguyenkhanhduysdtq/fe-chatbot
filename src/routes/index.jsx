




import ChatPage from "../components/pages/check/ChatPage"
import ContentRightSignup from "../components/pages/login/ContentRightSignup/ContentRightSignup"
import ContentRight from "../components/pages/login/content-right/ContentRight"

//publish router
const publicRoutes = [
    { path: '/', component: ContentRight, layout: null },
    { path: '/signup', component: ContentRightSignup, layout: null },
    { path: '/chat', component: ChatPage, layout: 1 },


]

const privateRoutes = [

]



export { publicRoutes, privateRoutes }