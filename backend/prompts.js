const prompts = [
    {
        text:
            'Natural Gas Is Now Being Referred to as "Freedom Gas" by The US Department of Energy',
        url:
            'https://www.sciencealert.com/us-department-of-energy-is-now-referring-to-natural-gas-as-freedom-gas',
        site: 'sciencealert.com',
    },
    {
        text:
            "Man Rescued From Taliban Didn't Believe Donald Trump Was President",
        url:
            'https://www.newsweek.com/man-rescued-taliban-didnt-believe-trump-was-president-685861',
        site: 'newsweek.com',
    },
    {
        text: 'Hunter Dies After Elephant Falls On Him',
        url:
            'https://www.news24.com/SouthAfrica/News/hunter-dies-after-shot-elephant-falls-on-him-20170521',
        site: 'news24.com',
    },
    {
        text:
            'Mike Pence Once Ratted Out His Fraternity Brothers For Having A Keg',
        url:
            'https://www.newsweek.com/mike-pence-once-ratted-out-his-fraternity-brothers-having-keg-735711',
        site: 'newsweek.com',
    },
    {
        text: 'Trump Dedicates Golf Trophy To Hurricane Victims',
        url:
            'https://thehill.com/homenews/administration/353355-trump-dedicates-golf-trophy-to-puerto-rico-hurricane-victims',
        site: 'thehill.com',
    },
    {
        text:
            "Ex-ICE Director: ICE Can't Be Equated To Nazis Since We're Just Following Orders",
        url:
            'https://mavenroundtable.io/theintellectualist/news/ex-ice-director-ice-can-t-be-equated-to-nazis-since-we-re-just-following-orders-gUCVH4E1CUi5Y73kZqpeNA/',
        site: 'mavenroundtable.io',
    },
    {
        text:
            "Uber's Search For A Female CEO Has Been Narrowed Down To Three Men",
        url:
            'https://www.denverpost.com/2017/08/05/uber-search-female-ceo-men-finalists/',
        site: 'denverpost.com',
    },
    {
        text:
            "Dogs Cannot Get 'Autism', British Veterinarian Association Warns After 'Anti-Vaxx' Movement Spread To Pets",
        url:
            'https://www.telegraph.co.uk/news/2018/04/25/dogs-cannot-get-autism-british-veterinary-association-warns/',
        site: 'telegraph.co.uk',
    },
    {
        text:
            'Somali Militant Group Al-Shabaab Announces Ban On Single-Use Plastic Bags',
        url: 'https://www.pedestrian.tv/news/al-shabaab-plastic-bag-ban/',
        site: 'pedestrian.tv',
    },
    {
        text:
            "United Nations Official Visiting Alabama To Investigate 'Great Poverty And Inequality'",
        url:
            'https://www.al.com/news/2017/12/united_nations_official_visiti.html',
        site: 'al.com',
    },
    {
        text:
            'Florida House Declares Porn A Public Health Risk Shortly After Denying Assault Rifle Ban',
        url:
            'https://thehill.com/homenews/state-watch/374816-florida-house-votes-to-declare-porn-a-public-health-risk-within-an-hour',
        site: 'thehill.com',
    },
    {
        text:
            'Passenger Turned Away From Two Flights After Wearing Ten Layers Of Clothing To Avoid Luggage Fee',
        url:
            'https://www.telegraph.co.uk/news/2018/01/16/passenger-turned-away-two-flights-wearing-10-layers-clothing/',
        site: 'telegraph.co.uk',
    },
    {
        text:
            "Sean Spicer Says Oprah Winfrey Doesn't Have The Political Experience To Be President",
        url:
            'https://www.itv.com/goodmorningbritain/news/sean-spicer-says-oprah-winfrey-doesnt-have-the-political-experience-to-be-president',
        site: 'itv.com',
    },
    {
        text:
            "UPS Loses Family's $846,000 Inheritance, Offers To Refund $32 Shipping Fee",
        url:
            'https://www.newsweek.com/ups-loses-846k-inheritance-offer-refund-shipping-fee-748764',
        site: 'newsweek.com',
    },
    {
        text:
            "Alabama Lawmaker: We Shouldn't Arm Teachers Because Most Are Women",
        url: 'https://www.al.com/news/2018/03/women_scare_of_guns.html',
        site: 'al.com',
    },
    {
        text:
            'Alcohol Level In Air At Fraternity Party Registers On Breathalyzer',
        url:
            'https://6abc.com/alcohol-in-air-at-frat-party-registers-on-breathalyzer/2802898/',
        site: '6abc.com',
    },
    {
        text:
            'Always Look On The Bright Side Of Life, Says CEO Who Raised EpiPen Price By More Than 400%',
        url:
            'https://www.latimes.com/business/lazarus/la-fi-lazarus-mylan-epipen-drug-prices-20180605-story.html',
        site: 'latimes.com',
    },
    {
        text: 'Man Sues Parents For Getting Rid Of His Vast Porn Collection',
        url: 'https://apnews.com/3886673dfef34c14a93ad5282d16a3bc',
        site: 'apnews.com',
    },
    //{
    //     text:
    //         'Charlotte Office Worker Charged After He Brought Donuts Glazed With His Own Semen To Boss’s Farewell Party',
    //     url:
    //         'https://the-daily-star.com/charlotte-office-worker-charged-after-he-brought-donuts-glazed-with-his-own-semen-to-bosss-farewell-party/',
    //     site: 'the-daily-star.com',
    // },
    {
        text:
            'South Carolina woman pulled over on toy truck while driving drunk, police say',
        url:
            'https://www.delawareonline.com/story/news/2019/06/15/megan-holman-nabbed-driving-toy-truck-drunk-south-carolina-police/1466429001/',
        site: 'www.delawareonline.com',
    },
    {
        text:
            'Man who thought he bought first house furious after it turns out to be 30cm strip of land',
        url:
            'https://7news.com.au/business/property/man-who-thought-he-bought-first-house-furious-after-it-turns-out-to-be-30cm-strip-of-land-c-168750',
        site: '7news.com.au',
    },
    {
        text:
            'Outkast’s André 3000 spotted walking around an airport playing the flute',
        url: 'https://tonedeaf.thebrag.com/outkasts-andre-3000-airport-flute/',
        site: 'tonedeaf.thebrag.com',
    },
    {
        text:
            '84yo Japanese Grandpa Becomes IG Influencer After Grandson Dresses Him',
        url:
            'https://www.worldofbuzz.com/84yo-japanese-grandpa-becomes-ig-influencer-after-grandson-dresses-him/',
        site: 'www.worldofbuzz.com',
    },
    {
        text: 'French Marathon Where People Drink Wine and Eat Cheese',
        url:
            'http://www.thinkinghumanity.com/2019/05/french-marathon-where-people-drink-wine-and-eat-cheese.html',
        site: 'www.thinkinghumanity.com',
    },
    {
        text: 'Sold-out crowd attends goat role-playing event in Redding',
        url:
            'https://www.stamfordadvocate.com/local/stamfordadvocate/article/Sold-out-crowd-attends-goat-role-playing-event-in-14000631.php',
        site: 'www.stamfordadvocate.com',
    },
    {
        text:
            'Illinois farmers give up on planting after floods, throw party instead',
        url:
            'https://www.reuters.com/article/us-usa-weather-planting/illinois-farmers-give-up-on-planting-after-floods-throw-party-instead-idUSKCN1TH0BQ',
        site: 'www.reuters.com',
    },
    {
        text: "'This Works': Group Says Drinking Your Own Pee Is Good For You",
        url:
            'https://detroit.cbslocal.com/2019/06/13/this-works-group-says-drinking-your-own-pee-good-for-you/',
        site: 'detroit.cbslocal.com',
    },
    {
        text: 'Washington state waterfront owners asked to take dead whales',
        url: 'https://apnews.com/3fa3e9078ff34306bf15d3854634251a',
        site: 'apnews.com',
    },
    {
        text: 'Female Crabs Only Eat Their Own Young When They’re Hungry',
        url: 'http://www.deepseanews.com/2014/07/females-crabs/',
        site: 'www.deepseanews.com',
    },
    {
        text: 'Spirit’s new strategy: Be a less terrible airline',
        url:
            'https://www.detroitnews.com/story/business/2019/06/14/spirit-airlines-new-strategy-less-terrible/39584091/',
        site: 'www.detroitnews.com',
    },
    {
        text: 'Pew pew: Xbox deodorant helps you smell like a gamer',
        url:
            'https://www.cnet.com/news/xbox-deodorant-helps-you-smell-like-a-gamer/',
        site: 'www.cnet.com',
    },
    {
        text: 'Golfer Hits Fan With His shot, Takes Pic with Him on the Ground',
        url:
            'https://www.sportsgossip.com/golfer-hits-fan-with-his-shot-takes-pic-with-him-on-the-ground/',
        site: 'www.sportsgossip.com',
    },
    {
        text:
            'Humans have started growing spikes in the back of their skulls because we use smartphones so much',
        url:
            'https://www.newsweek.com/humans-have-started-growing-spikes-back-their-skulls-because-we-use-smartphones-so-much-1443757',
        site: 'www.newsweek.com',
    },
    {
        text:
            'California court: Prison pot is OK, as long as inmates don’t inhale',
        url:
            'https://www.wmur.com/article/california-court-prison-pot-is-ok-as-long-as-inmates-don-t-inhale/28031298',
        site: 'www.wmur.com',
    },
    {
        text: "Star Trek 'Starfleet logo' spotted on Mars by NASA probe",
        url:
            'http://news.sky.com/story/star-trek-starfleet-logo-spotted-on-mars-by-nasa-probe-11741938',
        site: 'news.sky.com',
    },
    {
        text: 'Pour decisions? The better educated you are, the more you drink',
        url:
            'https://www.nbcnews.com/business/consumer/pour-decisions-better-educated-you-are-more-you-drink-n1017616',
        site: 'www.nbcnews.com',
    },
    {
        text:
            'FBI releases files on Playboy founder Hugh Hefner: Agents probing obscenity, wild parties found he looked lonely',
        url:
            'https://calgaryherald.com/news/world/fbi-releases-files-on-playboy-founder-hugh-hefner-agents-probing-obscenity-wild-parties-found-he-looked-lonely/wcm/49fc5382-2ffb-4b1e-83bc-497bbaea1bcf',
        site: 'calgaryherald.com',
    },
    {
        text:
            'Pakistan’s Khyber-Pakhtunkhwa Government Live Streams Facebook Press Conference With Cat Filter On.',
        url:
            'https://swarajyamag.com/insta/pakistans-khyber-pakhtunkhwa-government-streams-live-facebook-press-conference-with-cat-filter-on',
        site: 'swarajyamag.com',
    },
    {
        text:
            'Brother walks through front door after sisters take man they thought was him off life support',
        url: 'https://www.knoe.com/content/news/511303182.html',
        site: 'www.knoe.com',
    },
    {
        text:
            'DOT Manager Fired After Caught Driving For Rideshare Service During Normal Work Hours',
        url:
            'https://baltimore.cbslocal.com/2019/06/14/dot-manager-fired-after-caught-driving-for-rideshare-service-during-normal-work-hours/',
        site: 'baltimore.cbslocal.com',
    },
    {
        text:
            "Hard Rock Cafe releases 'The Golden Solo,' performed on world’s first playable burger guitar",
        url: 'https://attractionsmagazine.com/hard-rock-cafe-burger-guitar/',
        site: 'attractionsmagazine.com',
    },
    {
        text:
            "WWE superstar John Cena confesses he got an 'accidental boner' while wrestling",
        url:
            'https://twnews.co.uk/gb-news/wwe-superstar-john-cena-confesses-he-got-an-accidental-boner-while-wrestling',
        site: 'twnews.co.uk',
    },
    {
        text:
            'Denver school board bans use of handcuffs on elementary school students',
        url:
            'https://denverite.com/2019/06/14/denver-school-board-bans-use-of-handcuffs-on-elementary-school-students/',
        site: 'denverite.com',
    },
    {
        text:
            "Ephraim Police seek owner of 'criminal turkey' after apprehending jaywalking bird",
        url:
            'https://fox13now.com/2019/06/13/ephraim-police-seek-owner-of-criminal-bird-after-apprehending-jaywalking-turkey/',
        site: 'fox13now.com',
    },
]

module.exports = prompts
