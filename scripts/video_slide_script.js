document.addEventListener("DOMContentLoaded", function() {
  const videos = document.querySelectorAll(".video-container video");
  let currentIndex = 0;
  let currentVideo;

  function updateSlider() {
    const container = document.querySelector(".video-container");
    const containerWidth = container.offsetWidth;
    const videoWidth = videos[0].offsetWidth;
    const numVisibleVideos = 3;
    const startIndex = Math.max(0, currentIndex - 1);
    const endIndex = Math.min(videos.length, startIndex + numVisibleVideos);
    let slideAmount = -startIndex * (videoWidth + 10); // 10px margin

    // Adjust slide amount and container transform based on window width
    if (window.innerWidth < 1000) {
      slideAmount = -startIndex * ((containerWidth / numVisibleVideos) + 10);
      container.style.transform = `translateX(calc(50% - ${videoWidth / 2}px + ${slideAmount}px))`;
    } else {
      container.style.transform = `translateX(calc(40% - ${videoWidth / 2}px + ${slideAmount}px))`;
    }

    videos.forEach((video, index) => {
      if (index >= startIndex && index < endIndex) {
        video.style.opacity = 0.5;
        if (index === currentIndex) {
          video.style.opacity = 1;
          video.style.transform = "scale(1)";
        } else {
          video.style.transform = "scale(0.8)";
        }
        video.setAttribute("controls", "");
      } else {
        video.style.opacity = 0;
        video.style.transform = "scale(0.8)";
        video.removeAttribute("controls");
      }
    });
  }

  function selectVideo(index) {
    if (currentVideo) {
      currentVideo.pause(); // Pause the currently playing video
    }
    videos[currentIndex].classList.remove("active");
    currentIndex = index;
    videos[currentIndex].classList.add("active");
    currentVideo = videos[currentIndex];
    currentVideo.pause(); // Pause the newly selected video
    updateSlider();
  }

  // Automatically select the first video and pause it
  selectVideo(1);

  videos.forEach((video, index) => {
    video.addEventListener("click", () => {
      if (index !== currentIndex) {
        selectVideo(index);
      }
    });
  });

  window.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
      currentIndex = Math.max(0, currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      currentIndex = Math.min(videos.length - 1, currentIndex + 1);
    }
    selectVideo(currentIndex);
  });
});
