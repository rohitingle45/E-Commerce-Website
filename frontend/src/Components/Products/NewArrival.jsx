import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios  from 'axios';

const NewArrival = () => {
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  
  const [newArrivals , setNewArrivals] = useState([]);

  useEffect(()=>{
   const fetchNewArrivals = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
          setNewArrivals(response.data);
        } catch (error) {
          console.error(error);
        }
   }
   fetchNewArrivals();
  },[]);
  /* ---------------- BUTTON SCROLL ---------------- */
  const handleScroll = (dir) => {
    const amount = dir === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  /* ---------------- ENABLE / DISABLE ---------------- */
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    );
  };

  /* ---------------- MOUSE DRAG ---------------- */
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // drag speed
    scrollRef.current.scrollLeft = scrollStart - walk;
  };

  const stopDrag = () => setIsDragging(false);

  /* ---------------- TOUCH (MOBILE) ---------------- */
  const onTouchStart = (e) => {
    setStartX(e.touches[0].pageX);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const onTouchMove = (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollStart - walk;
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);

    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [newArrivals]);

  return (
    <section>
      {/* HEADER */}
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>

        {/* BUTTONS */}
        <div className="absolute right-0 bottom-[-30px] flex gap-2">
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 border rounded ${
              canScrollLeft ? "bg-white" : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft size={22} />
          </button>

          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className={`p-2 border rounded ${
              canScrollRight ? "bg-white" : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* CAROUSEL */}
      <div
        ref={scrollRef}
        className={`container mx-auto flex gap-6 overflow-x-scroll scrollbar-hide cursor-grab ${
          isDragging && "cursor-grabbing"
        }`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {newArrivals.map((p) => (
          <div
            key={p._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
              src={p.images[0].url}
              alt={p.name}
              className="rounded-lg select-none"
              draggable={false}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-4 rounded-b-lg backdrop-blur-md">
              <Link to={`/product/${p._id}`}>
                <h4>{p.name}</h4>
                <p>${p.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrival;
