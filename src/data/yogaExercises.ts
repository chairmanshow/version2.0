import { YogaExercise } from '../types/yoga';

export const yogaExercises: YogaExercise[] = [
  {
    id: 'vrikshasana',
    name: 'वृक्षासन',
    englishName: 'Tree Pose',
    description: 'A classical balancing posture that strengthens the legs, anchors stability, and sharpens mental focus.',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Stand upright with feet together and arms at your sides (Samasthiti).',
      'Shift your weight onto the left leg and bend your right knee.',
      'Place the sole of your right foot high on the inner left thigh or calf (avoid the knee joint).',
      'Bring your palms together in prayer position (Anjali Mudra) at chest level or extend arms overhead.',
      'Fix your gaze on an unmoving spot in front of you and breathe evenly.'
    ],
    breathing: 'Inhale while extending the spine and raising hands; maintain slow, rhythmic breathing while balancing.',
    benefits: ['Improves physical balance and coordination', 'Strengthens thighs, calves, ankles, and spine', 'Calms the nervous system and boosts focus'],
    modifications: 'Place your foot lower on the calf, or touch a fingertip to a nearby wall for balance.',
    precautions: 'Avoid placing the foot directly on the knee joint. Those with acute vertigo or high blood pressure should keep arms at chest level.',
    duration: '30 seconds per side'
  },
  {
    id: 'tadasana',
    name: 'ताड़ासन',
    englishName: 'Mountain Pose',
    description: 'The foundational standing posture in yoga that establishes optimal alignment, grounded posture, and body awareness.',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Stand with feet parallel, big toes touching, and heels slightly apart.',
      'Engage your thigh muscles, tuck your pelvis neutrally, and lengthen your spine.',
      'Interlace fingers, invert palms, and slowly raise arms overhead reaching skyward.',
      'Optionally lift onto the balls of your toes for calf elongation and enhanced balance.',
      'Hold the stretch with relaxed shoulders away from the ears.'
    ],
    breathing: 'Deep, steady diaphragmatic breathing through the nose.',
    benefits: ['Corrects spinal posture and rounded shoulders', 'Strengthens arches, calves, and abdominal core', 'Enhances full-body circulation'],
    modifications: 'Keep feet hip-width apart if balance feels unsteady; keep heels firmly on the mat.',
    precautions: 'If experiencing headache, severe insomnia, or low blood pressure, avoid prolonged heel lifting.',
    duration: '1 minute'
  },
  {
    id: 'adho_mukha',
    name: 'अधोमुख श्वानासन',
    englishName: 'Downward-Facing Dog',
    description: 'A complete rejuvenating inversion that decompresses the spine, stretches the hamstrings, and energizes the whole body.',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Start on all fours with hands shoulder-width and knees hip-width apart.',
      'Spread fingers wide and press firmly through palms and knuckles.',
      'Tuck toes, lift your knees off the floor, and send your hips back and upward toward the ceiling.',
      'Draw the chest gently toward the thighs while relaxing the head and neck.',
      'Gently work heels toward the ground without locking knees.'
    ],
    breathing: 'Inhale as you lift the pelvis; exhale deeply while softening the neck and settling into the stretch.',
    benefits: ['Stretches shoulders, hamstrings, and calves', 'Relieves lower back compression and sciatica', 'Improves cerebral blood flow and relieves mental fatigue'],
    modifications: 'Keep knees softly bent and heels lifted to protect tight hamstrings.',
    precautions: 'Avoid in cases of severe carpal tunnel syndrome, late pregnancy, or uncontrolled high blood pressure.',
    duration: '45 seconds'
  },
  {
    id: 'bhujangasana',
    name: 'भुजंगासन',
    englishName: 'Cobra Pose',
    description: 'An energizing prone backbend that expands the thoracic chest, tones abdominal organs, and relieves desk-sitting stiffness.',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593810450967-f9c42742e326?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1593810450967-f9c42742e326?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Lie face down on the mat with legs extended and tops of feet flat on the floor.',
      'Place hands beneath shoulders with elbows tucked close to your ribs.',
      'Press tops of feet, thighs, and pelvis firmly into the mat.',
      'Inhale and gently lift your chest off the mat using back muscles rather than arm push.',
      'Keep shoulders drawn back and neck comfortably aligned with your spine.'
    ],
    breathing: 'Inhale smoothly as you elevate the chest; exhale slowly as you maintain or release the pose.',
    benefits: ['Reverses hunching and rounded upper back', 'Massages digestive viscera and stimulates agni', 'Expands lung volume for improved respiration'],
    modifications: 'Practice Baby Cobra or Sphinx pose on forearms to reduce lower back load.',
    precautions: 'Do not practice if you have recent abdominal surgery, severe hernia, or acute lumbar disc herniation.',
    duration: '30 seconds'
  },
  {
    id: 'balasana',
    name: 'बालासन',
    englishName: 'Child\'s Pose',
    description: 'A deeply restorative resting posture that gently releases spinal tension, relaxes hips, and soothes the nervous system.',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Kneel on the mat, touch your big toes together, and separate knees hip-width or wider.',
      'Lower your hips back onto your heels.',
      'Exhale and bow your torso forward, resting your forehead gently on the mat.',
      'Extend arms comfortably forward or lay them back along your sides with palms up.',
      'Allow the shoulders to melt toward the floor and surrender any muscular holding.'
    ],
    breathing: 'Deep, slow abdominal breathing, feeling the back ribs expand with every breath.',
    benefits: ['Gently stretches hips, thighs, and ankles', 'Soothes stress, overthinking, and anxiety', 'Releases neck and lumbar spine tension'],
    modifications: 'Place a bolster or rolled blanket under torso or between buttocks and calves.',
    precautions: 'Avoid if experiencing diarrhea or severe acute knee inflammation.',
    duration: '1 minute'
  },
  {
    id: 'setu_bandhasana',
    name: 'सेतुबंधासन',
    englishName: 'Bridge Pose',
    description: 'A rejuvenating supine backbend that stimulates the thyroid, opens the ribcage, and strengthens glutes and hamstrings.',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Lie supine on your back with knees bent and feet flat on the floor, hip-width apart.',
      'Bring heels close enough so your fingertips can lightly brush them.',
      'Press through all four corners of feet and arms as you exhale to lift your pelvis.',
      'Interlace fingers under your back and roll shoulders beneath to broaden the chest.',
      'Keep thighs parallel and knees aligned directly above ankles.'
    ],
    breathing: 'Inhale expanding the ribcage; exhale keeping knees steady and hips gently elevated.',
    benefits: ['Tones pelvic floor and gluteal muscles', 'Stretches the chest, neck, and spine', 'Improves digestion and regulates thyroid balance'],
    modifications: 'Place a yoga block beneath the sacrum for a supportive restorative version.',
    precautions: 'Do not turn your head while in the pose to protect the cervical spine. Avoid with acute neck injury.',
    duration: '30 seconds'
  },
  {
    id: 'virabhadrasana1',
    name: 'वीरभद्रासन 1',
    englishName: 'Warrior I',
    description: 'A powerful lunging posture named after warrior Virabhadra that builds endurance, opens hip flexors, and strengthens core.',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Step your right foot forward into a deep lunge with knee stacked over ankle at 90 degrees.',
      'Turn the back left foot outward about 45 degrees, pressing the outer heel into the floor.',
      'Square your hips forward toward the front of the mat.',
      'Inhale and sweep both arms overhead with palms facing or touching.',
      'Draw the shoulder blades down the back while reaching tall through the fingers.'
    ],
    breathing: 'Full, steady breathing while grounding into the feet.',
    benefits: ['Builds cardiovascular stamina and leg strength', 'Opens tight hip flexors and chest', 'Fosters mental resolve and grounded stability'],
    modifications: 'Shorten stance or lift the back heel into a high crescent lunge if hips are tight.',
    precautions: 'Those with high blood pressure should keep hands on hips. Protect the front knee by not letting it track inward.',
    duration: '30 seconds per side'
  },
  {
    id: 'virabhadrasana2',
    name: 'वीरभद्रासन 2',
    englishName: 'Warrior II',
    description: 'A dynamic standing pose that expands hip flexibility, tones the entire lower body, and trains calm, unwavering focus.',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Take a wide stance, about 3.5 to 4 feet apart on the mat.',
      'Turn right foot forward (90 degrees) and left foot slightly inward (about 15 degrees).',
      'Bend the right knee so it aligns directly above the right ankle.',
      'Extend arms parallel to the floor, actively reaching from fingertip to fingertip.',
      'Gaze softly over the right middle finger (Drishti) and keep torso centered.'
    ],
    breathing: 'Inhale lengthening the spine; exhale deepening slightly into the front hip crease.',
    benefits: ['Deeply opens groin, chest, and shoulders', 'Strengthens quadriceps, calves, and ankles', 'Aids in relieving chronic lower back fatigue'],
    modifications: 'Reduce the depth of the front knee bend; rest hands on hips if shoulders tire.',
    precautions: 'Do not allow the front knee to extend past the toes or collapse inward.',
    duration: '30 seconds per side'
  },
  {
    id: 'paschimottanasana',
    name: 'पश्चिमोत्तानासन',
    englishName: 'Seated Forward Bend',
    description: 'A classic calming seated fold that stretches the entire posterior chain from heels to crown while quieting thoughts.',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552196563-5523e7a05052?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1552196563-5523e7a05052?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Sit on the floor with legs extended straight in front (Dandasana).',
      'Flex your feet, drawing toes back toward the shins.',
      'Inhale, sit tall, and raise arms overhead to elongate the spine.',
      'Exhale and hinge forward from the hip joints rather than rounding the lower back.',
      'Hold the outer edges of feet, shins, or ankles with relaxed shoulders.'
    ],
    breathing: 'Inhale to find spinal length; exhale to surrender further into the fold.',
    benefits: ['Intensely stretches hamstrings and spine', 'Calms the mind and alleviates mild depression or stress', 'Stimulates liver, kidneys, and abdominal digestion'],
    modifications: 'Loop a yoga strap around balls of feet, or keep knees slightly bent.',
    precautions: 'Avoid aggressive pulling in acute sciatica, slipped disc, or asthma.',
    duration: '45 seconds'
  },
  {
    id: 'marjaryasana',
    name: 'मार्जरीआसन',
    englishName: 'Cat Pose',
    description: 'A gentle spinal flexion movement on tabletop that mobilizes the vertebrae, releases shoulder strain, and synchronizes breath.',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508215885820-4523e431397b?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1508215885820-4523e431397b?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Begin in tabletop on hands and knees with wrists under shoulders and knees under hips.',
      'Ensure spine is neutral and fingers are spread wide.',
      'On an exhalation, round your spine toward the ceiling like a stretching cat.',
      'Draw the belly button in toward the spine and release the crown of your head downward.',
      'Maintain gentle engagement in the core throughout.'
    ],
    breathing: 'Slow, deliberate exhalation as the spine arches upwards.',
    benefits: ['Increases vertebral mobility and circulation', 'Relieves tension in upper back, neck, and shoulders', 'Gently tones abdominal muscles'],
    modifications: 'Place folded blanket beneath sensitive knees; form fists if wrists ache.',
    precautions: 'Keep neck aligned with spine if experiencing cervical spine tenderness.',
    duration: '30 seconds'
  },
  {
    id: 'bidalasana',
    name: 'बिटिलासन',
    englishName: 'Cow Pose',
    description: 'The complementary extension pose to Cat that opens the throat and chest, gently tilts the pelvis, and massages internal organs.',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Begin in tabletop posture with wrists below shoulders and knees below hips.',
      'On an inhalation, drop the belly gently toward the yoga mat.',
      'Lift the chin and chest, gazing upward toward the ceiling or sky.',
      'Broaden across the collarbones and pull shoulder blades away from ears.',
      'Allow the sit bones to lift gently upwards.'
    ],
    breathing: 'Smooth, deep inhalation as the chest opens forward.',
    benefits: ['Expands the anterior chest and lungs', 'Stimulates digestive organs and kidneys', 'Relieves stress and improves spinal flexibility'],
    modifications: 'Keep neck neutral looking straight down if neck pain is present.',
    precautions: 'Do not over-arch the lower back if prone to lumbar hyperlordosis.',
    duration: '30 seconds'
  },
  {
    id: 'trikonasana',
    name: 'त्रिकोणासन',
    englishName: 'Triangle Pose',
    description: 'A classic standing lateral stretch that lengthens the sides of the waist, strengthens the legs, and stabilizes the pelvis.',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Stand with feet wide apart (about 3.5 to 4 feet).',
      'Turn right foot out 90 degrees and left foot slightly inward.',
      'Inhale and raise arms laterally at shoulder level.',
      'Exhale and reach the right torso directly over the right leg.',
      'Rest right hand on shin, block, or floor while extending left arm straight up toward sky.'
    ],
    breathing: 'Deep, steady breathing, keeping chest open and uncollapsed.',
    benefits: ['Stretches hips, groins, hamstrings, and calves', 'Strengthens thighs, knees, and ankles', 'Aids in relieving back pain and stress'],
    modifications: 'Place the lower hand on a yoga block positioned outside the front ankle.',
    precautions: 'Avoid looking up if experiencing neck pain; gaze straight ahead or down.',
    duration: '30 seconds per side'
  },
  {
    id: 'dhanurasana',
    name: 'धनुरासन',
    englishName: 'Bow Pose',
    description: 'A full-body backward bend resembling an archer’s bow that revitalizes spinal nerves, tones core muscles, and improves posture.',
    difficulty: 'Advanced',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599447292415-385012581691?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1599447292415-385012581691?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Lie flat on your belly with arms beside your body, palms facing up.',
      'Bend knees and bring heels close to buttocks.',
      'Reach back with hands and grasp outside of ankles (not tops of feet).',
      'Inhale deeply and kick feet firmly into hands, lifting thighs and chest off the mat.',
      'Look forward softly, keeping neck long and breathing rhythmically into the abdomen.'
    ],
    breathing: 'Take slow, controlled breaths, feeling the gentle rocking motion on the belly.',
    benefits: ['Expands entire front body, chest, and throat', 'Deeply massages abdominal organs and combats constipation', 'Strengthens back extensor musculature'],
    modifications: 'Use a strap looped around ankles if unable to reach feet comfortably.',
    precautions: 'Do not perform if pregnant, or having abdominal ulcers, hernia, or severe lumbar issues.',
    duration: '20 seconds'
  },
  {
    id: 'salabhasana',
    name: 'शलभासन',
    englishName: 'Locust Pose',
    description: 'An accessible, potent posterior strengthener that develops back fortitude, elevates posture, and combats rounded desk back.',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Lie prone on the stomach with forehead resting on the floor and arms alongside torso.',
      'Turn palms inward or facing down toward the floor.',
      'Exhale and lift head, upper torso, arms, and legs off the mat.',
      'Reach back actively through toes and fingertips.',
      'Keep gaze down and slightly forward to keep back of neck elongated.'
    ],
    breathing: 'Inhale while sustaining height; exhale releasing excess shoulder tension.',
    benefits: ['Builds strength in spinal muscles, glutes, and hamstrings', 'Improves digestion and bowel regularity', 'Relieves fatigue and back discomfort'],
    modifications: 'Lift only legs first, then alternate with only upper body lift.',
    precautions: 'Avoid in acute headache, pregnancy, or serious spinal disc conditions.',
    duration: '30 seconds'
  },
  {
    id: 'savasana',
    name: 'शवासन',
    englishName: 'Corpse Pose',
    description: 'The supreme restorative integration pose of yoga where the mind settles into stillness and the body integrates practice benefits.',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    instructions: [
      'Lie flat on your back with legs naturally apart and feet falling open to sides.',
      'Rest arms alongside torso with palms facing upward and fingers naturally curled.',
      'Close eyes softly and soften forehead, jaw, tongue, and throat.',
      'Scan through the body from toes to crown, releasing every trace of tension.',
      'Remain completely motionless, resting in pure breath awareness.'
    ],
    breathing: 'Natural, spontaneous breathing with zero effort or control.',
    benefits: ['Lowers blood pressure and heart rate', 'Reduces anxiety, mental agitation, and fatigue', 'Promotes deep tissue recovery and parasympathetic balance'],
    modifications: 'Place a bolster or rolled pillow under knees to release lower back tension.',
    precautions: 'None. If lower back hurts flat on mat, keep knees bent or elevated on support.',
    duration: '5 minutes'
  }
];
