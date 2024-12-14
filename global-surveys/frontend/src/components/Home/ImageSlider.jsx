import { Carousel, Container } from "react-bootstrap";

const ImageSlider = () => {
  return (
    <Container
      fluid
      className="mb-4 mt-3 p-0"
      style={{ height: "100%", margin: "auto" }}
    >
      <Carousel>
        <Carousel.Item>
          <img
            style={{ height: "300px", borderRadius: "8px" }}
            className="d-block w-100"
            src="/assets/images/slider1.jpg"
            alt="banner1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{ height: "300px", borderRadius: "8px" }}
            className="d-block w-100"
            src="/assets/images/slider2.jpg"
            alt="banner2"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{ height: "300px", borderRadius: "8px" }}
            className="d-block w-100"
            src="/assets/images/slider3.jpg"
            alt="banner3"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{ height: "300px", borderRadius: "8px" }}
            className="d-block w-100"
            src="/assets/images/slider4.jpg"
            alt="banner4"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{ height: "300px", borderRadius: "8px" }}
            className="d-block w-100"
            src="/assets/images/slider5.jpg"
            alt="banner5"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{ height: "300px", borderRadius: "8px" }}
            className="d-block w-100"
            src="/assets/images/slider6.jpeg"
            alt="banner5"
          />
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default ImageSlider;
