import React from 'react'
import { Navbar, Footer } from '@/components';
import { Carousel, Button, Card, Accordion } from 'flowbite-react';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel pauseOnHover>
          <div className="flex h-full items-center justify-center bg-green-400">
            <p className="text-2xl text-white">Welcome to Funaab High School</p>
          </div>

          <div className="flex h-full items-center justify-center bg-green-400">
            <p className="text-2xl text-white">Funaab High School Academic Portals</p>
          </div>

          <div className="flex flex-col gap-2 h-full items-center justify-center bg-green-400">
            <p className="text-2xl text-white">View Results Here</p>
            <Button>View Results</Button>
          </div>
        </Carousel>
      </div>

      <div className="flex flex-row gap-4 justify-center items-center mt-5">
        <Card className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Portal
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, maxime!
          </p>
          <Button color="green">
            Login
            <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Card>

        <Card className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Staff Portal
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, maxime!
          </p>
          <Button color="green">
            Login
            <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Card>

        <Card className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Student Portal
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, maxime!
          </p>
          <Button color="green">
            Login
            <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center mt-5 w-100%">
        <Accordion>
          <Accordion.Panel>
            <Accordion.Title>Who we are</Accordion.Title>
            <Accordion.Content >
              <p className='mb-2 text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum est voluptate fugit ut dolorem rerum, enim sit nobis reiciendis sequi.</p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Where are we located</Accordion.Title>
            <Accordion.Content>
              <p className='mb-2 text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum est voluptate fugit ut dolorem rerum, enim sit nobis reiciendis sequi.</p>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Mission and Vision</Accordion.Title>
            <Accordion.Content>
              <p className='mb-2 text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum est voluptate fugit ut dolorem rerum, enim sit nobis reiciendis sequi.</p>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>

      <Footer />
    </>
  )
}

export default Home;