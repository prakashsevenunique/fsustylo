import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router,useLocalSearchParams} from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function PolicyScreen() {
    const { policyType } = useLocalSearchParams();
    if(policyType === "privacyPolicy"){
       return (
        <View className="flex-1 bg-white">
            {/* Header with Back Button */}
            <View className="flex-row items-center p-2 bg-pink-500 h-20 pt-8">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <MaterialIcons name="arrow-back" size={23} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold ml-2">Privacy Policy</Text>
            </View>

            {/* Privacy Policy Content */}
            <ScrollView className="p-6">
                <Text className="text-gray-900 text-lg font-semibold mb-4">Privacy Policy</Text>
                <Text className="text-gray-700 text-base mb-4">
                    This Privacy Policy explains how we collect, use, and protect your information when you use our app.
                </Text>
                <Text className="text-gray-700 text-base mb-2 font-semibold">1. Information We Collect</Text>
                <Text className="text-gray-600 text-base mb-4">
                    We collect personal information such as your name, mobile number, and email when you register or use our services.
                </Text>
                <Text className="text-gray-700 text-base mb-2 font-semibold">2. How We Use Your Information</Text>
                <Text className="text-gray-600 text-base mb-4">
                    Your data is used to provide and improve our services, process transactions, and enhance user experience.
                </Text>
                <Text className="text-gray-700 text-base mb-2 font-semibold">3. Security</Text>
                <Text className="text-gray-600 text-base mb-4">
                    We take reasonable measures to protect your personal information from unauthorized access and disclosure.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eaque quod quam minima reprehenderit unde sint? Sit quae eum, numquam temporibus est illo, repudiandae hic delectus tenetur iusto, fugiat voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, consequatur repellat nam sit at quos placeat vitae consectetur, consequuntur impedit harum laudantium cupiditate voluptatibus maxime blanditiis quia maiores quibusdam ratione?
                    Dolorum numquam voluptatibus perferendis inventore, rerum repellat debitis error voluptatum recusandae quam possimus sed nihil minima sit accusantium officia nostrum blanditiis provident tenetur nemo modi porro dicta vero accusamus! Amet.
                    Voluptas, ipsa minus voluptate odio perspiciatis alias laboriosam veniam optio. Dignissimos sit quod eum consequuntur suscipit! Alias, sequi voluptas perferendis nobis facere deserunt ipsam, dolore modi ut labore voluptatem. Commodi!
                    Placeat labore aut aliquam dolorem eos, eligendi similique earum incidunt delectus quia nihil commodi! Quasi vitae cum nesciunt. Illum ullam amet earum ratione assumenda? Eius repellat sunt velit necessitatibus suscipit.
                    Porro repudiandae sequi quisquam, rem sunt repellat. Ullam dolore deserunt laudantium, molestiae ducimus officiis deleniti, magnam, adipisci nemo inventore aut. Ab, animi vel ullam eaque ipsum laudantium qui! Perferendis, ex.
                    Veniam cumque eius illum. Cumque sed quibusdam atque impedit maxime quo accusamus, laboriosam itaque vero eaque nam dolore in obcaecati, temporibus assumenda. Ipsam ea recusandae molestias qui! Quo, accusantium deserunt.
                    Sapiente, debitis eos. Placeat, autem repellendus, impedit illo error quibusdam facere voluptas accusamus sed quam officia quo inventore, in quis iure fuga deserunt! Incidunt velit, totam aliquid explicabo obcaecati numquam.
                    Earum temporibus maxime officiis, dolores enim dicta sint, quos quam repellendus omnis nemo nostrum delectus similique accusantium ducimus error minus iusto, facilis voluptatibus qui rerum consequatur quisquam consequuntur? Unde, alias.
                    Rerum ducimus ipsum expedita cupiditate illo. Aspernatur dolorem praesentium adipisci quia non. Corporis mollitia et tempore impedit labore non odit recusandae in doloremque, eaque, quaerat laboriosam aliquam omnis assumenda fuga.
                    Provident, similique mollitia deserunt quis numquam, explicabo, dolorem saepe maxime ullam voluptate eligendi incidunt perspiciatis perferendis sunt. Eligendi totam enim voluptate! Dolor alias sit quas ducimus recusandae. Sapiente, ea repellat.
                </Text>
            </ScrollView>
        </View>
    );  
    }
    else if(policyType === "terms" ){
        return (
         <View className="flex-1 bg-white">
             <StatusBar style="auto" />
             {/* Header with Back Button */}
             <View className="flex-row items-center p-2 bg-pink-500 h-20 pt-8">
                 <TouchableOpacity onPress={() => router.back()} className="p-2">
                     <MaterialIcons name="arrow-back" size={23} color="white" />
                 </TouchableOpacity>
                 <Text className="text-white text-lg font-bold ml-2">Terms and Conditions</Text>
             </View>
 
             {/* Privacy Policy Content */}
             <ScrollView className="p-6 pt-2">
                 <Text className="text-gray-900 text-lg font-semibold mb-4">terms and conditions</Text>
                 <Text className="text-gray-700 text-base mb-4">
                     This Privacy Policy explains how we collect, use, and protect your information when you use our app.
                 </Text>
                 <Text className="text-gray-700 text-base mb-2 font-semibold">1. Information We Collect</Text>
                 <Text className="text-gray-600 text-base mb-4">
                     We collect personal information such as your name, mobile number, and email when you register or use our services.
                 </Text>
                 <Text className="text-gray-700 text-base mb-2 font-semibold">2. How We Use Your Information</Text>
                 <Text className="text-gray-600 text-base mb-4">
                     Your data is used to provide and improve our services, process transactions, and enhance user experience.
                 </Text>
                 <Text className="text-gray-700 text-base mb-2 font-semibold">3. Security</Text>
                 <Text className="text-gray-600 text-base mb-7">
                     We take reasonable measures to protect your personal information from unauthorized access and disclosure.
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eaque quod quam minima reprehenderit unde sint? Sit quae eum, numquam temporibus est illo, repudiandae hic delectus tenetur iusto, fugiat voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, consequatur repellat nam sit at quos placeat vitae consectetur, consequuntur impedit harum laudantium cupiditate voluptatibus maxime blanditiis quia maiores quibusdam ratione?
                     Dolorum numquam voluptatibus perferendis inventore, rerum repellat debitis error voluptatum recusandae quam possimus sed nihil minima sit accusantium officia nostrum blanditiis provident tenetur nemo modi porro dicta vero accusamus! Amet.
                     Voluptas, ipsa minus voluptate odio perspiciatis alias laboriosam veniam optio. Dignissimos sit quod eum consequuntur suscipit! Alias, sequi voluptas perferendis nobis facere deserunt ipsam, dolore modi ut labore voluptatem. Commodi!
                     Placeat labore aut aliquam dolorem eos, eligendi similique earum incidunt delectus quia nihil commodi! Quasi vitae cum nesciunt. Illum ullam amet earum ratione assumenda? Eius repellat sunt velit necessitatibus suscipit.
                     Porro repudiandae sequi quisquam, rem sunt repellat. Ullam dolore deserunt laudantium, molestiae ducimus officiis deleniti, magnam, adipisci nemo inventore aut. Ab, animi vel ullam eaque ipsum laudantium qui! Perferendis, ex.
                     Veniam cumque eius illum. Cumque sed quibusdam atque impedit maxime quo accusamus, laboriosam itaque vero eaque nam dolore in obcaecati, temporibus assumenda. Ipsam ea recusandae molestias qui! Quo, accusantium deserunt.
                     Sapiente, debitis eos. Placeat, autem repellendus, impedit illo error quibusdam facere voluptas accusamus sed quam officia quo inventore, in quis iure fuga deserunt! Incidunt velit, totam aliquid explicabo obcaecati numquam.
                     Earum temporibus maxime officiis, dolores enim dicta sint, quos quam repellendus omnis nemo nostrum delectus similique accusantium ducimus error minus iusto, facilis voluptatibus qui rerum consequatur quisquam consequuntur? Unde, alias.
                     Rerum ducimus ipsum expedita cupiditate illo. Aspernatur dolorem praesentium adipisci quia non. Corporis mollitia et tempore impedit labore non odit recusandae in doloremque, eaque, quaerat laboriosam aliquam omnis assumenda fuga.
                     Provident, similique mollitia deserunt quis numquam, explicabo, dolorem saepe maxime ullam voluptate eligendi incidunt perspiciatis perferendis sunt. Eligendi totam enim voluptate! Dolor alias sit quas ducimus recusandae. Sapiente, ea repellat.
                 </Text>
             </ScrollView>
         </View>
     );  
     }
    else{
        return (
         <View className="flex-1 bg-white">
             <StatusBar style="auto" />
             {/* Header with Back Button */}
             <View className="flex-row items-center p-2 bg-pink-500 h-20 pt-8">
                 <TouchableOpacity onPress={() => router.back()} className="p-2">
                     <MaterialIcons name="arrow-back" size={23} color="white" />
                 </TouchableOpacity>
                 <Text className="text-white text-lg font-bold ml-2">Content Policy</Text>
             </View>
 
             {/* Privacy Policy Content */}
             <ScrollView className="p-6 pt-2">
                 <Text className="text-gray-900 text-lg font-semibold mb-4">Content Policy</Text>
                 <Text className="text-gray-700 text-base mb-4">
                     This Content Policy explains how we collect, use, and protect your information when you use our app.
                 </Text>
                 <Text className="text-gray-700 text-base mb-2 font-semibold">1. Information We Collect</Text>
                 <Text className="text-gray-600 text-base mb-4">
                     We collect personal information such as your name, mobile number, and email when you register or use our services.
                 </Text>
                 <Text className="text-gray-700 text-base mb-2 font-semibold">2. How We Use Your Information</Text>
                 <Text className="text-gray-600 text-base mb-4">
                     Your data is used to provide and improve our services, process transactions, and enhance user experience.
                 </Text>
                 <Text className="text-gray-700 text-base mb-2 font-semibold">3. Security</Text>
                 <Text className="text-gray-600 text-base mb-7">
                     We take reasonable measures to protect your personal information from unauthorized access and disclosure.
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eaque quod quam minima reprehenderit unde sint? Sit quae eum, numquam temporibus est illo, repudiandae hic delectus tenetur iusto, fugiat voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, consequatur repellat nam sit at quos placeat vitae consectetur, consequuntur impedit harum laudantium cupiditate voluptatibus maxime blanditiis quia maiores quibusdam ratione?
                     Dolorum numquam voluptatibus perferendis inventore, rerum repellat debitis error voluptatum recusandae quam possimus sed nihil minima sit accusantium officia nostrum blanditiis provident tenetur nemo modi porro dicta vero accusamus! Amet.
                     Voluptas, ipsa minus voluptate odio perspiciatis alias laboriosam veniam optio. Dignissimos sit quod eum consequuntur suscipit! Alias, sequi voluptas perferendis nobis facere deserunt ipsam, dolore modi ut labore voluptatem. Commodi!
                     Placeat labore aut aliquam dolorem eos, eligendi similique earum incidunt delectus quia nihil commodi! Quasi vitae cum nesciunt. Illum ullam amet earum ratione assumenda? Eius repellat sunt velit necessitatibus suscipit.
                     Porro repudiandae sequi quisquam, rem sunt repellat. Ullam dolore deserunt laudantium, molestiae ducimus officiis deleniti, magnam, adipisci nemo inventore aut. Ab, animi vel ullam eaque ipsum laudantium qui! Perferendis, ex.
                     Veniam cumque eius illum. Cumque sed quibusdam atque impedit maxime quo accusamus, laboriosam itaque vero eaque nam dolore in obcaecati, temporibus assumenda. Ipsam ea recusandae molestias qui! Quo, accusantium deserunt.
                     Sapiente, debitis eos. Placeat, autem repellendus, impedit illo error quibusdam facere voluptas accusamus sed quam officia quo inventore, in quis iure fuga deserunt! Incidunt velit, totam aliquid explicabo obcaecati numquam.
                     Earum temporibus maxime officiis, dolores enim dicta sint, quos quam repellendus omnis nemo nostrum delectus similique accusantium ducimus error minus iusto, facilis voluptatibus qui rerum consequatur quisquam consequuntur? Unde, alias.
                     Rerum ducimus ipsum expedita cupiditate illo. Aspernatur dolorem praesentium adipisci quia non. Corporis mollitia et tempore impedit labore non odit recusandae in doloremque, eaque, quaerat laboriosam aliquam omnis assumenda fuga.
                     Provident, similique mollitia deserunt quis numquam, explicabo, dolorem saepe maxime ullam voluptate eligendi incidunt perspiciatis perferendis sunt. Eligendi totam enim voluptate! Dolor alias sit quas ducimus recusandae. Sapiente, ea repellat.
                 </Text>
             </ScrollView>
         </View>
     );  
     }
   
}
