// import React from "react";
// import { View, Text, Dimensions, Image } from "react-native";
// import Carousel from "react-native-reanimated-carousel";

// const { width } = Dimensions.get("window");

// // Dummy Data
// const sliderImages = [
//   { id: 1, image: "https://via.placeholder.com/400x200" },
//   { id: 2, image: "https://via.placeholder.com/400x200" },
//   { id: 3, image: "https://via.placeholder.com/400x200" }
// ];

// export default function Carousel() {
//   return (
//     <View className="items-center mt-4">
//       <Carousel
//         loop
//         width={width - 40}
//         height={200}
//         autoPlay
//         data={sliderImages}
//         scrollAnimationDuration={1000}
//         renderItem={({ item }) => (
//           <View className="rounded-lg overflow-hidden shadow-md">
//             <Image source={{ uri: item.image }} className="w-full h-full" />
//           </View>
//         )}
//       />
//     </View>
//   );
// }
