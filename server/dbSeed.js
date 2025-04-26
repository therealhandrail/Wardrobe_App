const {
  createUser,
  createClothing,
  createOutfit,
  createOutfitClothes,
  createClothingTag,
  createOutfitTag,
  createComment
} = require('./db');

const seedDatabases = async() => {
  const currentUsers = await Promise.all([
    createUser({ username: 'Brett', email: 'brett@bmail.com', password: 'brett_pw', is_admin: true}),
    createUser({ username: 'Laura', email: 'laura@bmail.com', password: 'laura_pw', is_admin: true}),
    createUser({ username: 'Ben', email: 'ben@bmail.com', password: 'ben_pw'}),
    createUser({ username: 'Emma', email: 'emma@bmail.com', password: 'emma_pw'}),
    createUser({ username: 'Nick', email: 'nick@bmail.com', password: 'nick_pw'}),
    createUser({ username: 'Julia', email: 'julia@bmail.com', password: 'julia_pw'}),
    createUser({ username: 'Amadeo', email: 'amadeo@bmail.com', password: 'amadeo_pw', is_admin: true}),
    createUser({ username: 'Eliot', email: 'eliot@bmail.com', password: 'eliot_pw', is_admin: true})
  ]);

  const currentClothing = await Promise.all([
    createClothing({name: 'Bella Mini Dress', user_id: currentUsers[1].id, clothing_type: 'Dress', store_link: 'https://www.ae.com/us/en/p/women/dresses/mini-dresses/ae-bella-mini-dress/1399_8555_400?menu=cat4840004', clothing_img_link: 'https://s7d2.scene7.com/is/image/aeo/1399_8555_400_f?$pdp-mdg-opt$&fmt=webp'}),
    createClothing({name: 'Blue & White Earrings', user_id: currentUsers[1].id, clothing_type: 'Earrings', store_link: 'https://www.ae.com/us/en/p/women/jewelry/earrings/aeo-blue-white-earrings-6-pack/0484_8385_709?menu=cat4840004', clothing_img_link: 'https://s7d2.scene7.com/is/image/aeo/0484_8385_709_f?$pdp-md-opt$&fmt=webp'}),
    createClothing({name: 'Hadyn White Leather', user_id: currentUsers[1].id, clothing_type: 'Shoes', store_link: 'https://www.stevemadden.com/collections/womens-sandals/products/hadyn-white-leather', clothing_img_link: 'https://www.stevemadden.com/cdn/shop/files/STEVEMADDEN_MENS_HADYN_WHITE-LEATHER_02_1f942cbe-4f79-4bf3-bd9a-208861be8850.jpg?v=1705412390&width=853'}),
    createClothing({name: 'Nike Windrunner Jacket', user_id: currentUsers[1].id, clothing_type: 'Jacket', store_link: 'https://www.nike.com/t/windrunner-womens-loose-uv-woven-full-zip-jacket-slBEqppF/FV6304-320', clothing_img_link: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b5554617-3793-4fe6-9210-05d4c3663484/W+NSW+NK+WR+WVN+UV+FZ+JKT.png'}),
    createClothing({name: 'Nike Windrunner Pants', user_id: currentUsers[1].id, clothing_type: 'Pants', store_link: 'https://www.nike.com/t/windrunner-womens-high-waisted-woven-open-hem-pants-GtvrqzsF/FV7655-320', clothing_img_link: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c97b45d7-f8cd-4f9b-9950-dc89ad62e80d/W+NSW+NK+WR+WVN+HR+OH+PANT.png'}),
    createClothing({name: 'Nike Sportswear Chill Knit', user_id: currentUsers[1].id, clothing_type: 'Shirt', store_link: 'https://www.nike.com/t/sportswear-chill-knit-womens-cropped-t-shirt-M7J1qL/HF9538-233', clothing_img_link: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/816304e4-085b-4501-8c3b-82e059e68e96/W+NSW+NK+CHLL+KNT+CRP.png'}),
    createClothing({name: 'Nike Initiator', user_id: currentUsers[1].id, clothing_type: 'Shoes', store_link: 'https://www.nike.com/t/initiator-womens-shoes-kbt4lC/IB4339-001', clothing_img_link: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/7f70ff54-e8ab-4164-806d-d89cc6b04a34/WMNS+NIKE+INITIATOR.png'}),
    createClothing({name: 'Carhartt Men\'s Relaxed Fit Washed Duck Sherpa-Lined Jacket', user_id: currentUsers[4].id, clothing_type: 'Jacket', store_link: 'https://www.amazon.com/Carhartt-Relaxed-Washed-Sherpa-Lined-3X-Large/dp/B08BG81MFW/ref=sr_1_8?crid=1LONL8KWIZ7XF&dib=eyJ2IjoiMSJ9.JJ6aVxgtXdqXeT2P4JOStPg_TVDJsRHOdkQfwAM8emIv3B5Kbeafpt3xY5ja8TG1ISbGpIVZZKjW9LSh86knhOwTC5gTrF8UIRRPLM9p6BgjAUny9I8lGHvhtfGnzd9r89N4fk7zyK-vFeaJ97dF36GMqbkE48Mpl4_Xz7kyR4sbIjj_xx49usuYcRC6PTVLqa8EC6W5XBN-ePxLgkgPpJkjTvxZvJbqWuaS1naSjv1aWQYJjaRHvxjmM5AfZ7Wv4WzZYvc8ADEnXZu4dk6wQs4xz53FR3RigmRs2ckOjzI.aG-kgUVL_h_m8hNrnxQXpQZEzeRBQFvCGUCz8F-WecY&dib_tag=se&keywords=carhartt+jacket&qid=1744480678&sprefix=carhartt+jacket%2Caps%2C106&sr=8-8', clothing_img_link: 'https://m.media-amazon.com/images/I/61ngsNN-+KS._AC_SX679_.jpg'}),
    createClothing({name: '550 Relaxed Fit Men\'s Jeans', user_id: currentUsers[4].id, clothing_type: 'Pants', store_link: 'https://www.levi.com/US/en_US/clothing/men/jeans/relaxed/550-relaxed-fit-mens-jeans/p/005500059', clothing_img_link: 'https://lsco.scene7.com/is/image/lsco/005500059-dynamic1-pdp?fmt=webp&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=309&hei=309'}),
    createClothing({name: 'Gildan Unisex Adult Heavy Cotton T-Shirt, Style G5000', user_id: currentUsers[4].id, clothing_type: 'Shirt', store_link: 'https://www.amazon.com/Gildan-Cotton-T-Shirt-Military-3X-Large/dp/B07MGYHJW9/ref=sr_1_15?crid=SCTXUFB6UB1&dib=eyJ2IjoiMSJ9.DF-h9UTf_PvycySFIYPYpD6ah1aOMmYeZWL1NTxYM-1r3tjNhU5KnheoMLm25-DhMUbv5eUJ6rhlgE2fi_TSMlbQg5rkAXdMaTOES4lfHcOG83yCV-9fv6B8VRsuWp4GqKjeDIBnZErYT5U_3P1tQdUIIRldIz43iqmbNRRR7oE2bBZ3njZf1C7E3LMZvwfw_MovMyIbiSB9pYBnAK5JX0AfaAcrFY9VsybmMp3IWWbeMSMmWRMEc-mMmvl_p5RIYHdg5reM_GFAS_xoUf7Z0zT_A_Cqu6qXXaCPV6qTkpA.thwJyZhnBrHQ7kkd8yexhRPVsvle6Muk0gKqsgYRQGc&dib_tag=se&keywords=green+tshirt&qid=1744481024&sprefix=green+tshirt%2Caps%2C126&sr=8-15', clothing_img_link: 'https://m.media-amazon.com/images/I/61sdznnj--L._AC_SX679_.jpg'}),
    createClothing({name: 'Frontier 6" Water Resistant Steel Toe Boot', user_id: currentUsers[4].id, clothing_type: 'Shoes', store_link: 'https://www.amazon.com/Carhartt-FN6165-M11M-Frontier-Water-Resistant/dp/B0CT21WMY5/ref=sr_1_6?crid=2061J4D0ARCRX&dib=eyJ2IjoiMSJ9.F6IvDrCjOfHvpdMsf9YvDTKyvvNz6yzXIUmnkrhelvZ-lnf2xPoynyTpCi1IW-BEQW2-rJplP-rqSn4-fXU7ZA4eccyKoLKROUcccvfBNEZgeiP-Kpd690cEJV86YfRuZZ56JDJMkTTmU-ij8hiOVHtOjNc7QqZ5qO5Dd_y9HPS7-6AJsr9szEEBhUXu7brifUZyhom9Yz-Y3d_1Ty0sDbyHJAFdhTNjUMR-VuV7uZ579MJ0zoCsiiiq478w373W-DY80Ws09Jf6V4KSJuVfOWSNN5mA4ogm-4C_qWgTVmA.E4C20CL957mx3Jh1XxFQmIK60Cp31B4xTPplhGqtEyw&dib_tag=se&keywords=Frontier%2B6%22%2BWater%2BResistant%2BSteel%2BToe%2BBoot&qid=1744481170&sprefix=frontier%2B6%2Bwater%2Bresistant%2Bsteel%2Btoe%2Bboot%2Caps%2C201&sr=8-6&th=1', clothing_img_link: 'https://m.media-amazon.com/images/I/71DSGmoFYmL._AC_SX679_.jpg'}),
    createClothing({name: 'Men\'s Buffalo Bills Josh Allen Nike Royal Team Game Player Jersey', user_id: currentUsers[4].id, clothing_type: 'Shirt', store_link: 'https://www.nflshop.com/buffalo-bills/mens-buffalo-bills-josh-allen-nike-royal-team-game-player-jersey/t-14714612+p-2508097930322+z-9-3457892066?_ref=p-ALP:m-GRID:i-r0c0:po-0', clothing_img_link: 'https://fanatics.frgimages.com/buffalo-bills/mens-nike-josh-allen-royal-buffalo-bills-team-game-player-jersey_pi3892000_altimages_ff_3892791-6f767e79dff6cc808994alt2_full.jpg?_hv=2&w=900'}),
    createClothing({name: 'Nike Form Men\'s Dri-FIT Tapered Versatile Pants', user_id: currentUsers[4].id, clothing_type: 'Pants', store_link: 'https://www.nike.com/t/form-mens-dri-fit-tapered-versatile-pants-SPLfgc/FB7497-010?nikemt=true&cp=80476278987_search_--g-21728772664-171403009167--c-1012443763-00196608716891&dplnk=member&gad_source=1&gbraid=0AAAAADy86kPBG3vMqHVh6_L7O-gHQZrS3&gclid=Cj0KCQjw2ZfABhDBARIsAHFTxGzHt_gDI5OLUSQiBHFv_0g3MZqRkJ--JMx4dI-5VvfwuGu_YTKBPq8aAnpjEALw_wcB&gclsrc=aw.ds', clothing_img_link: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b547ec0f-0195-4474-a3f5-67d59b1cc040/M+NK+DF+FORM+PANT+TPR.png'}),
    createClothing({name: 'Men\'s New Era Buffalo Bills 9Fifty A-Frame Snapback Hat', user_id: currentUsers[4].id, clothing_type: 'Hat', store_link: 'https://www.dtlr.com/products/new-era-bills-9fifty-snapback-70892227-cream', clothing_img_link: 'https://www.dtlr.com/cdn/shop/files/New_20Era_70892227079.jpg?v=1727792905'}),
    createClothing({name: 'Nike Air Monarch IV Men\'s Cross-Training Shoes', user_id: currentUsers[4].id, clothing_type: 'Shoes', store_link: 'https://www.kohls.com/product/prd-902047/nike-air-monarch-iv-cross-trainers-men.jsp?skuid=92111541&CID=seo_offers&utm_campaign=SAG&utm_medium=organic&utm_source=google&utm_product=92111541&gStoreCode=1312&gQT=1', clothing_img_link: 'https://media.kohlsimg.com/is/image/kohls/902047_White_Navy?wid=805&hei=805&op_sharpen=1'}),
    //createClothing({name: '', user_id: currentUsers[].id, clothing_type: '', store_link: '', clothing_img_link: ''}),
  ]);

  const currentOutfits = await Promise.all([
    createOutfit({name: 'Springy Blues', user_id: currentUsers[1].id, previously_worn: false, share_publicly: true}),
    createOutfit({name: 'Running Green', user_id: currentUsers[1].id, previously_worn: false, share_publicly: true}),
    createOutfit({name: 'Simple Work Outfit', user_id: currentUsers[4].id, previously_worn: true, share_publicly: true}),
    createOutfit({name: 'Bill\'s Game Apparel', user_id: currentUsers[4].id, previously_worn: true, share_publicly: true}),
    //createOutfit({name: '', user_id: currentUsers[].id, previously_worn: , share_publicly: }),
  ]);

  const currentOutfitClothes = await Promise.all([
    createOutfitClothes({outfit_id: currentOutfits[0].id, clothing_id: currentClothing[0].id}),
    createOutfitClothes({outfit_id: currentOutfits[0].id, clothing_id: currentClothing[1].id}),
    createOutfitClothes({outfit_id: currentOutfits[0].id, clothing_id: currentClothing[2].id}),
    createOutfitClothes({outfit_id: currentOutfits[1].id, clothing_id: currentClothing[3].id}),
    createOutfitClothes({outfit_id: currentOutfits[1].id, clothing_id: currentClothing[4].id}),
    createOutfitClothes({outfit_id: currentOutfits[1].id, clothing_id: currentClothing[5].id}),
    createOutfitClothes({outfit_id: currentOutfits[1].id, clothing_id: currentClothing[6].id}),
    createOutfitClothes({outfit_id: currentOutfits[2].id, clothing_id: currentClothing[7].id}),
    createOutfitClothes({outfit_id: currentOutfits[2].id, clothing_id: currentClothing[8].id}),
    createOutfitClothes({outfit_id: currentOutfits[2].id, clothing_id: currentClothing[9].id}),
    createOutfitClothes({outfit_id: currentOutfits[2].id, clothing_id: currentClothing[10].id}),
    createOutfitClothes({outfit_id: currentOutfits[3].id, clothing_id: currentClothing[11].id}),
    createOutfitClothes({outfit_id: currentOutfits[3].id, clothing_id: currentClothing[12].id}),
    createOutfitClothes({outfit_id: currentOutfits[3].id, clothing_id: currentClothing[13].id}),
    createOutfitClothes({outfit_id: currentOutfits[3].id, clothing_id: currentClothing[14].id}),
    //createOutfitClothes({outfit_id: currentOutfits[].id, clothing_id: currentClothing[].id}),
  ]);

  const currentClothingTags = await Promise.all([
    createClothingTag({clothing_id: currentClothing[0].id, tag: 'Casual'}),
    createClothingTag({clothing_id: currentClothing[1].id, tag: 'Jewelry'}),
    createClothingTag({clothing_id: currentClothing[2].id, tag: 'Warm Weather'}),
    createClothingTag({clothing_id: currentClothing[3].id, tag: 'Green'}),
    createClothingTag({clothing_id: currentClothing[4].id, tag: 'Green'}),
    createClothingTag({clothing_id: currentClothing[5].id, tag: 'Casual'}),
    createClothingTag({clothing_id: currentClothing[6].id, tag: 'Running'}),
    createClothingTag({clothing_id: currentClothing[7].id, tag: 'Cold Weather'}),
    createClothingTag({clothing_id: currentClothing[8].id, tag: 'Casual'}),
    createClothingTag({clothing_id: currentClothing[9].id, tag: 'Green'}),
    createClothingTag({clothing_id: currentClothing[10].id, tag: 'Work Wear'}),
    createClothingTag({clothing_id: currentClothing[11].id, tag: 'Jersey'}),
    createClothingTag({clothing_id: currentClothing[12].id, tag: 'Athletic'}),
    createClothingTag({clothing_id: currentClothing[13].id, tag: 'Casual'}),
    createClothingTag({clothing_id: currentClothing[14].id, tag: 'Running'}),
    //createClothingTag({clothing_id: currentClothing[].id, tag: ''}),
  ]);

  const currentOutfitTags = await Promise.all([
    createOutfitTag({outfit_id: currentOutfits[0].id, tag: 'Spring'}),
    createOutfitTag({outfit_id: currentOutfits[1].id, tag: 'Athletic'}),
    createOutfitTag({outfit_id: currentOutfits[2].id, tag: 'Work Wear'}),
    createOutfitTag({outfit_id: currentOutfits[3].id, tag: 'Bills Apparel'}),
    //createOutfitTag({outfit_id: currentOutfits[].id, tag: ''}),
  ]);

  const currentComments = await Promise.all([
    createComment({user_id: currentUsers[3].id, outfit_id: currentOutfits[0].id, written_rating: 'So Cute!'}),
    createComment({user_id: currentUsers[4].id, outfit_id: currentOutfits[0].id, written_rating: 'That\'s my favorite color'}),
    createComment({user_id: currentUsers[5].id, outfit_id: currentOutfits[0].id, written_rating: 'Perfect for a picnic!'}),
    createComment({user_id: currentUsers[2].id, outfit_id: currentOutfits[1].id, written_rating: 'Was this comfortable to run in?'}),
    createComment({user_id: currentUsers[5].id, outfit_id: currentOutfits[1].id, written_rating: 'I love this shade of green <3'}),
    createComment({user_id: currentUsers[3].id, outfit_id: currentOutfits[1].id, written_rating: 'Cool'}),
    createComment({user_id: currentUsers[1].id, outfit_id: currentOutfits[2].id, written_rating: 'Great boots! I know those will last a while.'}),
    createComment({user_id: currentUsers[3].id, outfit_id: currentOutfits[2].id, written_rating: 'I love those jeans!'}),
    createComment({user_id: currentUsers[2].id, outfit_id: currentOutfits[2].id, written_rating: 'Nice dude'}),
    createComment({user_id: currentUsers[1].id, outfit_id: currentOutfits[3].id, written_rating: 'Go Bills!'}),
    //createComment({user_id: currentUsers[].id, outfit_id: currentOutfits[].id, written_rating: ''}),
  ]);

}
module.exports = {seedDatabases};
