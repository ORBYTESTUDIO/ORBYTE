import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './Header'
gsap.registerPlugin(ScrollTrigger)

export default function LandingSections() {
    
    const titleRef = useRef(null);

    useEffect(() => {

    

        gsap.fromTo(
            titleRef.current,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            },
            {
              opacity: 0,
              y: -80,
              filter: 'blur(8px)',
              scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 80%',
                end: 'top 30%',
                scrub: true, // Animación ligada al scroll
              },
            }
          );

    }, [])

  return (
    <>
    
    <body>
        <Header/>
        <section className="section home">

        
         <h1 ref={titleRef}  className='home-text'>WE CREATE<br />USER EXPERIENCES</h1>

        </section>

        <section class="section texto">
        
        </section>

        <section class="section final">
        
        </section>

    
  </body>

      
    </>
  )
}
