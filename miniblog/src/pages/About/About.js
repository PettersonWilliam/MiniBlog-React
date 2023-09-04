// import styles from './About/About.module.css';

import { Link } from 'react-router-dom';

import React from 'react'

const About = () => {
  return (
    <div className="{ styles.about }">
        <h2>
            Sobre o Mini <span>Blog</span>
        </h2>
        <p>Este Projeto consiste em um blog feito com react no front-end e firebase no back-end</p>
        <Link to='/posts/create' className='btn'>
            Criar post
        </Link>
    </div>
  )
}

export default About;
