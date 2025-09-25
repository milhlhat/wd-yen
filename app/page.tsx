"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { MapPin, Heart, Gift } from "lucide-react";
import { CONFIGURATION } from "@/constants/configuration";
import Image from "next/image";
import { useScrollEffects, useParallax } from "@/hooks/use-scroll-effects";
import PhotoAlbum from "@/components/PhotoAlbum";

export default function WeddingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [guestForm, setGuestForm] = useState({
    name: "",
    attendance: "yes",
    guestCount: "1",
    wishes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Scroll effects for different sections
  const coupleSection = useScrollEffects({ threshold: 0.2 });
  const storySection = useScrollEffects({ threshold: 0.1 });
  const giftSection = useScrollEffects({ threshold: 0.2 });
  const guestSection = useScrollEffects({ threshold: 0.2 });
  const thankYouSection = useScrollEffects({ threshold: 0.3 });

  // Parallax effects for background elements
  const storyParallax = useParallax(0.2);

  const carouselPhotos = [
    "./carosel_1.jpg",
    "./carosel_2.jpg",
    "./carosel_3.jpg",
    "./carosel_4.jpg",
    "./carosel_5.jpg",
    "./carosel_6.jpg",
    "./carosel_7.jpg",
    "./carosel_8.jpg",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setGuestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const baseUrlEnv =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const baseUrl = baseUrlEnv.replace(/\/$/, "");

    const accepted = guestForm.attendance === "yes";
    const payload: {
      name: string;
      accepted?: boolean;
      guestCount?: number | string;
      message?: string;
    } = {
      name: guestForm.name.trim(),
      accepted,
      guestCount: accepted ? Number(guestForm.guestCount) : "",
      message: guestForm.wishes?.trim() || undefined,
    };

    try {
      const res = await fetch(`${baseUrl}/api/groom/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Request failed");

      console.log("Groom invitation response saved:", data);
      setGuestForm({
        name: "",
        attendance: "yes",
        guestCount: "1",
        wishes: "",
      });
      setSubmitSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error("Failed to submit groom invite:", error);
      setIsSubmitting(false);
    }
  };

  // Gift section helpers
  const bankAccountOwner = "Nguyễn Minh Nhật";
  const bankAccountNumber = "nhat1999";
  const bankName = "TPBank";
  const qrImageSrc = "/QR_banking.jpg"; // Replace with your QR image path

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(bankAccountNumber);
      console.log("Copied STK to clipboard");
    } catch (err) {
      console.error("Failed to copy STK", err);
    }
  };

  const downloadQrImage = () => {
    try {
      const link = document.createElement("a");
      link.href = qrImageSrc;
      link.download = "qr-minh-nhat-tpbank.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 scroll-snap-y touch-action-pan-y">
      {/* Hero Banner Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden scroll-snap-start">
        {/* Background Images - Different for mobile and desktop */}
        <div className="absolute inset-0">
          {/* Desktop Background */}
          <div className="hidden md:block absolute inset-0">
            <img
              src="./banner_desktop.jpg"
              alt="Wedding couple"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Mobile Background */}
          <div className="md:hidden absolute inset-0">
            <img
              src="./banner_mobile.jpg"
              alt="Wedding couple mobile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlay with gradient blur at bottom */}
          <div className="absolute inset-0 bg-black/30"></div>
          {/* Bottom blur gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 w-full max-w-4xl mx-auto">
          {/* iOS-style frosted glass card */}
          <div className="backdrop-blur-[1px] bg-white/10 rounded-[2rem] md:max-h-[80vh] overflow-hidden p-6 sm:p-8 md:p-10 border border-white/20 shadow-2xl mx-4 sm:mx-6 md:mx-12 lg:mx-16 md:my-6">
            <div className="space-y-4 sm:space-y-6 md:space-y-5">
              <p className="text-base sm:text-lg md:text-xl font-quicksand font-light tracking-wide opacity-90">
                Save The Date
              </p>

              <div className="space-y-3 sm:space-y-4 md:space-y-4">
                {CONFIGURATION.groomFirst ? (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.groomName}
                    </h1>

                    <div className="text-xl sm:text-2xl md:text-3xl font-quicksand font-light">
                      &
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.brideName}
                    </h1>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.brideName}
                    </h1>

                    <div className="text-xl sm:text-2xl md:text-3xl font-quicksand font-light">
                      &
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-ballet text-balance tracking-[2px]">
                      {CONFIGURATION.groomName}
                    </h1>
                  </>
                )}
              </div>

              <div className="w-full h-px bg-white/30 my-6 sm:my-8 md:my-6"></div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="grid grid-cols-3 items-center text-xl sm:text-2xl">
                  <span className="font-quicksand font-medium text-right">09:15</span>
                  <span className="text-5xl sm:text-6xl md:text-7xl font-quicksand font-light text-center">
                    26
                  </span>
                  <span className="font-quicksand font-medium text-left">CHỦ NHẬT</span>
                </div>
                <p className="text-lg sm:text-xl md:text-xl font-quicksand font-light text-center">
                  10 - 2025
                </p>
              </div>

              <div className="w-full h-px bg-white/30 my-6 sm:my-8 md:my-6"></div>

              <div className="space-y-2 sm:space-y-3 md:space-y-3">
                <p className="text-sm sm:text-base md:text-base font-quicksand font-medium">
                  Địa điểm tổ chức
                </p>
                <p className="text-xs sm:text-sm md:text-sm font-quicksand opacity-90 leading-relaxed">
                  120 Khu Bình Lục Hạ, Phường Đông Triều
                  <br />
                  Tỉnh Quảng Ninh
                </p>
              </div>

              {/* Action Icons */}
              <div className="flex justify-center gap-3 sm:gap-4 md:gap-5 pt-4 sm:pt-6 md:pt-0">
                <button
                  onClick={() =>
                    window.open(CONFIGURATION.mapUrl as string, "_blank")
                  }
                  className="p-3 sm:p-4 md:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
                <button
                  onClick={() => scrollToSection("gift")}
                  className="p-3 sm:p-4 md:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
                <button
                  onClick={() => scrollToSection("guest")}
                  className="p-3 sm:p-4 md:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Couple Introduction Section */}
      <section ref={coupleSection.elementRef} className="py-20 px-6 scroll-snap-start">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            coupleSection.isVisible 
              ? "animate-fadeInUp opacity-100" 
              : "opacity-0 translate-y-8"
          }`}>
            <h2 className="text-4xl md:text-5xl font-eb-garamond text-gray-800 mb-4">
              Our Story
            </h2>
            <p className="text-lg font-quicksand text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Two hearts, one beautiful journey. Meet the couple who found love
              in each other.
            </p>
          </div>

          {/* Couple Photos - Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Bride */}
            <div
              className={`text-center transform transition-all duration-1000 ${
                coupleSection.isVisible
                  ? "animate-fadeInLeft opacity-100 delay-200"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-full max-w-80 h-80 sm:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-100 to-pink-100">
                  <img
                    src="the_bride_avatar.jpg"
                    alt="Ngọc Yến - Bride"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "0 0px",
                      scale: "1.5",
                    }}
                  />
                </div>
                {/* iOS-style floating label */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
                    <p className="font-quicksand font-medium text-gray-800">
                      The Bride
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-imperial-script text-gray-800 mb-4">
                Ngọc Yến
              </h3>
              <p className="font-quicksand text-gray-600 leading-relaxed max-w-sm mx-auto">
                A beautiful heart with endless grace, making every day brighter
                with her love and warmth.
              </p>
            </div>
            {/* Groom */}
            <div
              className={`text-center transform transition-all duration-1000 ${
                coupleSection.isVisible
                  ? "animate-fadeInRight opacity-100 delay-400"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-full max-w-80 h-80 sm:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img
                    src="the_groom_avatar.jpg"
                    alt="Minh Nhật - Groom"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "0 6px",
                      scale: "1.1",
                    }}
                  />
                </div>
                {/* iOS-style floating label */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
                    <p className="font-quicksand font-medium text-gray-800">
                      The Groom
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-imperial-script text-gray-800 mb-4">
                Minh Nhật
              </h3>
              <p className="font-quicksand text-gray-600 leading-relaxed max-w-sm mx-auto">
                A kind soul with a passion for life, bringing joy and laughter
                to every moment we share together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Album Section */}
      <PhotoAlbum photos={carouselPhotos} />

      {/* Love Story Section */}
      <section ref={storySection.elementRef} className="py-20 px-6 bg-[#f3d9dc] scroll-snap-start">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            storySection.isVisible 
              ? "animate-bounceIn opacity-100" 
              : "opacity-0 scale-95"
          }`}>
            <h2 className="text-5xl md:text-6xl font-eb-garamond text-gray-800 tracking-wide">
              LOVE STORY
            </h2>
          </div>

          {/* Desktop layout with a centered vertical line */}
          <div className="relative hidden md:block">
            {/* Center vertical line */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-300"></div>

            {/* Top-left photo + caption on right */}
            <div className="absolute top-0 right-1/2 -translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <Image
                  src="./story_1.jpg"
                  alt="Couple gaming together"
                  className="w-full h-80 object-cover rounded-[24px]  object-[0_-10px]"
                  width={320}
                  height={300}
                />
              </div>
            </div>
            <p className="absolute top-6 left-1/2 translate-x-[20px] max-w-xs text-gray-500 text-xl font-quicksand font-light leading-relaxed text-center">
              Chú rể gặp cô dâu ở<br />
              <span className="italic">'Binh Nguyên Vô Tận'</span>
            </p>

            {/* Middle-right photo + caption on left */}
            <div className="absolute top-[320px] left-1/2 translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <img
                  src="./story_2.jpg"
                  alt="Graduation together"
                  className="w-full h-80 object-cover rounded-[24px]"
                />
              </div>
            </div>
            <p className="absolute top-[480px] right-1/2 -translate-x-[20px] max-w-xs text-gray-500 text-xl font-quicksand font-light leading-relaxed text-center">
              Cùng nhau tốt nghiệp 🎓
            </p>

            {/* Bottom-left photo + caption on right */}
            <div className="absolute top-[640px] right-1/2 -translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <img
                  src="./story_3.jpg"
                  alt="Couple traveling"
                  className="w-full h-80 object-cover rounded-[24px]"
                />
              </div>
            </div>
            <p className="absolute top-[800px] left-1/2 translate-x-[20px] max-w-xs text-gray-500 text-xl font-quicksand font-light leading-relaxed text-center">
              Cùng nhau đi du lịch
            </p>

            {/* Fourth event - Cầu Hôn Lung Linh 💍 */}
            <div className="absolute top-[950px] left-1/2 translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <img
                  src="./story_4.jpg"
                  alt="Proposal moment"
                  className="w-full h-80 object-cover rounded-[24px]"
                />
              </div>
            </div>
            <p className="absolute top-[1100px] right-1/2 -translate-x-[20px] max-w-xs text-gray-500 text-xl font-quicksand font-light leading-relaxed text-center">
              Cầu Hôn Lung Linh 💍
            </p>

            {/* Fifth event - Dạm ngõ */}
            <div className="absolute top-[1270px] right-1/2 -translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <img
                  src="./story_5.jpg"
                  alt="Engagement ceremony"
                  className="w-full h-80 object-cover rounded-[24px]"
                />
              </div>
            </div>
            <p className="absolute top-[1430px] left-1/2 translate-x-[20px] max-w-xs text-gray-500 text-xl font-quicksand font-light leading-relaxed text-center">
              "Dạm ngõ"
            </p>

            {/* Sixth event - Về chung một nhà 🏡 */}
            <div className="absolute top-[1590px] left-1/2 translate-x-[60px] w-80">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl">
                <img
                  src="./story_6.jpg"
                  alt="Moving in together"
                  className="w-full h-80 object-cover rounded-[24px]  object-[0_-10px]"
                />
              </div>
            </div>
            <p className="absolute top-[1740px] right-1/2 -translate-x-[20px] max-w-xs text-gray-500 text-xl font-quicksand font-light leading-relaxed text-center">
              Về chung một nhà 🏡
            </p>

            {/* Spacer for desktop layout height to reveal absolutely positioned items */}
            <div className="h-[2000px]"></div>
          </div>

          {/* Mobile stacked layout */}
          <div className="md:hidden space-y-14">
            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <img
                  src="story_1.jpg"
                  alt="Couple gaming together"
                  className="w-full h-100 object-cover rounded-[24px] object-[0_-10px]"
                />
              </div>
              <p className="text-lg font-quicksand text-gray-500 font-light leading-relaxed">
                Chú rể gặp cô dâu ở<br />
                <span className="italic">'Binh Nguyên Vô Tận'</span>
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <img
                  src="story_2.jpg"
                  alt="Graduation together"
                  className="w-full h-100 object-cover rounded-[24px]"
                />
              </div>
              <p className="text-lg font-quicksand text-gray-500 font-light leading-relaxed">
                Cùng nhau tốt nghiệp 🎓
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <img
                  src="story_3.jpg"
                  alt="Couple traveling"
                  className="w-full h-100 object-cover rounded-[24px]"
                />
              </div>
              <p className="text-lg font-quicksand text-gray-500 font-light leading-relaxed">
                Cùng nhau đi du lịch
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <img
                  src="story_4.jpg"
                  alt="Proposal moment"
                  className="w-full h-100 object-cover rounded-[24px]"
                />
              </div>
              <p className="text-lg font-quicksand text-gray-500 font-light leading-relaxed">
                Cầu Hôn Lung Linh 💍
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <img
                  src="story_5.jpg"
                  alt="Engagement ceremony"
                  className="w-full h-100 object-cover rounded-[24px]"
                />
              </div>
              <p className="text-lg font-quicksand text-gray-500 font-light leading-relaxed">
                "Dạm ngõ"
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-[28px] p-1 bg-white shadow-2xl mb-6">
                <img
                  src="story_6.jpg"
                  alt="Moving in together"
                  className="w-full h-100 object-cover rounded-[24px]  object-[0_-10px]"
                />
              </div>
              <p className="text-lg font-quicksand text-gray-500 font-light leading-relaxed">
                Về chung một nhà 🏡
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Section - Mừng Cưới */}
      <section ref={giftSection.elementRef} id="gift" className="py-20 px-6 bg-white scroll-snap-start">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            giftSection.isVisible 
              ? "animate-scaleIn opacity-100" 
              : "opacity-0 scale-90"
          }`}>
            <h2 className="text-5xl md:text-6xl font-ballet text-[#8c4a4a] mb-6">
              Mừng Cưới
            </h2>
            <p className="text-gray-600 font-quicksand leading-relaxed max-w-2xl mx-auto">
              Mình rất muốn được chụp chung với bạn những tấm hình kỷ niệm vì vậy
              hãy đến sớm hơn một chút bạn yêu nhé! Đám cưới của chúng mình sẽ
              trọn vẹn hơn khi có thêm lời chúc phúc và sự hiện diện của các bạn.
            </p>
          </div>

          {/* QR + Bank info box */}
          <div className="mt-10 mx-auto max-w-xl border-2 border-dashed border-[#b77c7c] rounded-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-rose-50/40">
            <button
              type="button"
              onClick={downloadQrImage}
              className="rounded-xl overflow-hidden shadow hover:shadow-md focus:outline-none"
              title="Bấm để tải ảnh QR"
            >
              <img
                src={qrImageSrc}
                alt="QR chuyển khoản"
                className="w-full h-full object-contain bg-white"
              />
            </button>
            <div className="text-left space-y-2">
              <p className="font-quicksand text-gray-800">
                <span className="font-medium">CTK:</span> {bankAccountOwner}
              </p>
              <p className="font-quicksand text-gray-800">
                <span className="font-medium">STK:</span>{" "}
                <button
                  type="button"
                  onClick={copyAccountNumber}
                  className="underline decoration-dotted text-rose-700 hover:text-rose-800"
                  title="Bấm để copy STK"
                >
                  {bankAccountNumber}
                </button>
              </p>
              <p className="font-quicksand text-gray-800">
                <span className="font-medium">NH:</span> {bankName}
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600 font-quicksand">
            ** Bấm vào STK để copy hoặc bấm vào ảnh QR để lưu
          </p>
        </div>
      </section>

      {/* Guest Information Form Section */}
      <section
        ref={guestSection.elementRef}
        id="guest"
        className="py-20 px-6 bg-gradient-to-br from-rose-50 to-pink-50 scroll-snap-start"
      >
        <div className="max-w-2xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            guestSection.isVisible 
              ? "animate-slideInFromBottom opacity-100" 
              : "opacity-0 translate-y-12"
          }`}>
            <h2 className="text-4xl md:text-5xl font-eb-garamond text-gray-800 mb-4">
              Xác Nhận Tham Dự
            </h2>
            <p className="text-lg font-quicksand text-gray-600 leading-relaxed">
              Chúng tôi rất mong được chia sẻ niềm vui này cùng bạn
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50"
          >
            <div className="space-y-6">
              {/* Guest Name */}
              <div>
                <label className="block text-sm font-quicksand font-medium text-gray-700 mb-2">
                  Tên khách mời *
                </label>
                <input
                  type="text"
                  required
                  value={guestForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-quicksand"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              {/* Attendance Confirmation */}
              <div>
                <label className="block text-sm font-quicksand font-medium text-gray-700 mb-3">
                  Xác nhận tham dự *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={guestForm.attendance === "yes"}
                      onChange={(e) =>
                        handleFormChange("attendance", e.target.value)
                      }
                      className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                    />
                    <span className="ml-3 font-quicksand text-gray-700">
                      Có, tôi sẽ tham dự
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={guestForm.attendance === "no"}
                      onChange={(e) =>
                        handleFormChange("attendance", e.target.value)
                      }
                      className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                    />
                    <span className="ml-3 font-quicksand text-gray-700">
                      Xin lỗi, tôi bận mất rồi
                    </span>
                  </label>
                </div>
              </div>

              {/* Guest Count - Only show if attending */}
              {guestForm.attendance === "yes" && (
                <div>
                  <label className="block text-sm font-quicksand font-medium text-gray-700 mb-3">
                    Số lượng khách
                  </label>
                  <div className="flex gap-4">
                    {["1", "2", "3"].map((count) => (
                      <label key={count} className="flex items-center">
                        <input
                          type="radio"
                          name="guestCount"
                          value={count}
                          checked={guestForm.guestCount === count}
                          onChange={(e) =>
                            handleFormChange("guestCount", e.target.value)
                          }
                          className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                        />
                        <span className="ml-2 font-quicksand text-gray-700">
                          {count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishes */}
              <div>
                <label className="block text-sm font-quicksand font-medium text-gray-700 mb-2">
                  Lời chúc
                </label>
                <textarea
                  value={guestForm.wishes}
                  onChange={(e) => handleFormChange("wishes", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm resize-none font-quicksand"
                  placeholder="Gửi lời chúc tốt đẹp đến cô dâu chú rể..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`${
                  submitSuccess
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : isSubmitting
                    ? "bg-rose-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                } w-full text-white font-quicksand font-medium py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-5 w-5 rounded-full border-2 border-white/60 border-t-transparent animate-spin"></span>
                    <span>Đang gửi...</span>
                  </>
                ) : submitSuccess ? (
                  <span>Đã gửi thành công!</span>
                ) : (
                  <span>Gửi xác nhận</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* Thank You Section */}
      <section ref={thankYouSection.elementRef} id="thank-you" className="py-24 px-6 bg-white scroll-snap-start">
        <div className="max-w-4xl mx-auto">
          <div className={`relative flex flex-col items-center transition-all duration-1000 ${
            thankYouSection.isVisible 
              ? "animate-bounceIn opacity-100" 
              : "opacity-0 scale-90"
          }`}>
            {/* Floral background frame */}
            <img
              src="/thankyou_flower_background.png"
              alt="Floral frame"
              className="z-10 pointer-events-none select-none w-[400px] h-[600px] -top-[90px]  sm:w-[680px] sm:h-[830px] sm:-top-[140px] max-w-full absolute left-1/2 -translate-x-1/2"
              aria-hidden
            />
            {/* Arched photo */}
            <div className="relative w-[300] h-[400px] rounded-[160px] sm:w-[380px] sm:h-[540px] sm:rounded-[180px]  overflow-hidden shadow-xl border-2 border-rose-300 bg-white">
              <img
                src="/thankyou_bride_groom.jpg"
                alt="Bride and Groom"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title */}
            <h3 className="mt-14 md:mt-18 text-[68px] leading-none md:text-[108px] font-eb-garamond text-[#7d4a4a] text-center">
              Thank you!
            </h3>
          </div>
        </div>
      </section>
      <section className="h-30"></section>
    </div>
  );
}
