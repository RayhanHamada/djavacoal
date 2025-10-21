"use client";
import { useState } from "react";

import { VIDEO_GALLERY_DATA } from "../../lib";
import { VideoCarousel, VideoModal, VideoThumbnail } from "../atoms";

export default function ProductDescription() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState("");

    const handleOpenModal = (videoSrc: string) => {
        setCurrentVideo(videoSrc);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentVideo("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
            <div className="container mx-auto space-y-8 px-4">
                {/* Main Video Section */}
                <div className="mx-auto max-w-4xl">
                    <VideoThumbnail
                        videoSrc={VIDEO_GALLERY_DATA.main.video}
                        thumbnailSrc={VIDEO_GALLERY_DATA.main.thumbnail}
                        onOpenModal={() =>
                            handleOpenModal(VIDEO_GALLERY_DATA.main.video)
                        }
                    />
                </div>

                {/* Auto-Sliding Carousel */}
                <div className="w-full">
                    <VideoCarousel
                        items={VIDEO_GALLERY_DATA.carousel}
                        onThumbnailClick={(item) => handleOpenModal(item.video)}
                    />
                </div>
            </div>

            {/* Video Modal */}
            <VideoModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                videoSrc={currentVideo}
            />
        </div>
    );
}
