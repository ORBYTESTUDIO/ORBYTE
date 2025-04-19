import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './Header'
gsap.registerPlugin(ScrollTrigger)

export default function LandingSections() {
    
    const titleRef = useRef(null);
    const aboutUsRef = useRef(null);
    const aboutDownRef = useRef(null);



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

          
        gsap.fromTo(
          aboutUsRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
          },
          {
            opacity: 0,
            y: -20,
            filter: 'blur(8px)',
            scrollTrigger: {
              trigger: aboutUsRef.current,
              start: 'top 20%',
              end: 'top 0%',
              scrub: true, // Animación ligada al scroll
            },
          }
        );

        gsap.fromTo(
          aboutDownRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
          },
          {
            opacity: 0,
            y: -70,
            filter: 'blur(8px)',
            scrollTrigger: {
              trigger: aboutDownRef.current,
              start: 'top 70%',
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

        <section id='about' class="section about">

          <div className="about-title" ref={aboutUsRef}>
            <h2 >ABOUT US</h2>
            <h1 >WHAT IS ORBYTE?</h1>
          </div>
          <div className="about-text" ref={aboutDownRef}>
            <p>ORBYTE is a digital design and development studio founded <br/> in Buenos Aires, Argentina.</p>
            <p>We specialize in creating realistic and functional<br/> user experiences, merging design, technology, and <br/> interaction.</p>
          </div>

        </section>

        <section id='d' class="section final">
        
        </section>

    
  </body>

      
    </>
  )
}
