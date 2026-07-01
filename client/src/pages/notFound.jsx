import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import notFound from '/404.svg'

function NotFound() {
    return (
        <>
        <Navbar />
        <main>
            <img src={notFound} alt="404" className="w-full max-w-lg mx-auto" />
        </main>
        <Footer />
        </>
    )
}

export default NotFound