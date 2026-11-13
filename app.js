const { createApp, ref, reactive, computed, onMounted, onUnmounted } =
        Vue;
      const config = window.PRAISE_CONFIG || {};
      const apiBaseUrl = String(
        config.apiBaseUrl ||
          "https://m001234567-after-school-toot.onrender.com",
      ).replace(/\/$/, "");
      const useMockData = config.useMockData === true;
      const subjectImagePaths = Object.freeze({
        technology: "images/lesson-technology.svg",
        art: "images/lesson-art.svg",
        sport: "images/lesson-sport.svg",
        music: "images/lesson-music.svg",
        nature: "images/lesson-nature.svg",
        writing: "images/lesson-writing.svg",
        making: "images/lesson-making.svg",
        cooking: "images/lesson-cooking.svg",
        dance: "images/lesson-dance.svg",
        media: "images/lesson-media.svg",
      });
      const mockActivities = [
        [
          "65f0b1c2d3e4f56789012341",
          "Code Creators Club",
          "Technology",
          "Main lab",
          "Ava",
          "Bello",
          "A friendly introduction to creative coding, problem solving and small digital projects.",
          8,
          12,
          "Tuesdays, 4:00 to 5:30 pm",
          18,
          16,
          7,
        ],
        [
          "65f0b1c2d3e4f56789012342",
          "Colour and Clay Studio",
          "Art",
          "Art room",
          "Tola",
          "Adeyemi",
          "Children experiment with drawing, painting and clay in a relaxed, practical art session.",
          6,
          10,
          "Wednesdays, 4:00 to 5:15 pm",
          15,
          14,
          4,
        ],
        [
          "65f0b1c2d3e4f56789012343",
          "Junior Sports Lab",
          "Sport",
          "Sports hall",
          "Musa",
          "Okafor",
          "Build confidence, coordination and teamwork through rotating games and movement challenges.",
          7,
          11,
          "Fridays, 3:45 to 5:00 pm",
          14,
          20,
          11,
        ],
        [
          "65f0b1c2d3e4f56789012344",
          "Junior Music Makers",
          "Music",
          "Music room",
          "Zara",
          "Ibrahim",
          "Explore rhythm, songwriting and simple instruments in a supportive small group.",
          7,
          11,
          "Thursdays, 4:00 to 5:15 pm",
          16,
          12,
          3,
        ],
        [
          "65f0b1c2d3e4f56789012345",
          "Little Gardeners",
          "Nature",
          "School garden",
          "Chidi",
          "Okoro",
          "Plant, care for and learn about seasonal growing through hands-on garden activities.",
          6,
          10,
          "Mondays, 4:00 to 5:15 pm",
          13,
          12,
          5,
        ],
        [
          "65f0b1c2d3e4f56789012346",
          "Story Makers",
          "Writing",
          "Library",
          "Amaka",
          "Yusuf",
          "Turn bright ideas into characters, scenes and short stories with playful writing prompts.",
          8,
          12,
          "Tuesdays, 4:00 to 5:15 pm",
          14,
          14,
          6,
        ],
        [
          "65f0b1c2d3e4f56789012347",
          "Build and Tinker Lab",
          "Making",
          "Design lab",
          "Daniel",
          "Obi",
          "Design, test and improve clever builds using everyday materials and simple mechanisms.",
          8,
          12,
          "Thursdays, 4:00 to 5:30 pm",
          17,
          16,
          8,
        ],
        [
          "65f0b1c2d3e4f56789012348",
          "Young Chefs Kitchen",
          "Cooking",
          "Food lab",
          "Fatima",
          "Bello",
          "Prepare simple dishes while learning kitchen confidence and food safety.",
          8,
          12,
          "Mondays, 4:00 to 5:30 pm",
          16,
          12,
          4,
        ],
        [
          "65f0b1c2d3e4f56789012349",
          "Dance and Movement",
          "Dance",
          "Dance studio",
          "Grace",
          "Eze",
          "Find rhythm, balance and confidence through joyful movement sessions.",
          6,
          11,
          "Wednesdays, 4:00 to 5:15 pm",
          13,
          14,
          3,
        ],
        [
          "65f0b1c2d3e4f5678901234a",
          "Photo Explorers",
          "Media",
          "Media room",
          "Kene",
          "Nwosu",
          "Learn the basics of visual storytelling with cameras, light and composition.",
          9,
          13,
          "Fridays, 4:00 to 5:30 pm",
          17,
          10,
          4,
        ],
      ].map(
        ([
          id,
          name,
          category,
          location,
          teacherFirstName,
          teacherLastName,
          description,
          minAge,
          maxAge,
          schedule,
          price,
          capacity,
          placesBooked,
        ]) => ({
          _id: id,
          name,
          category,
          location,
          teacherFirstName,
          teacherLastName,
          description,
          minAge,
          maxAge,
          schedule,
          price,
          capacity,
          placesBooked,
          isActive: true,
        }),
      );
      const makeReference = () =>
        `BF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      function requestWithThen(path, options = {}) {
        return fetch(`${apiBaseUrl}${path}`, options)
          .catch(() => {
            throw new Error(
              "We could not reach the service. Check your connection and try again.",
            );
          })
          .then((response) =>
            response
              .json()
              .catch(() => {
                throw new Error(
                  "The service returned an invalid response. Please try again later.",
                );
              })
              .then((result) => {
                if (!response.ok || !result.success)
                  throw new Error(
                    result.message || "Something went wrong. Please try again.",
                  );
                return result.data;
              }),
          );
      }
      function getActivity(id) {
        if (useMockData) {
          const activity = mockActivities.find(
            (item) => item._id === id && item.isActive,
          );
          if (!activity) throw new Error("Activity not found.");
          return Promise.resolve(activity);
        }
        return requestWithThen(`/api/activities/${encodeURIComponent(id)}`);
      }
      function createBooking(booking) {
        if (useMockData)
          return new Promise((resolve) =>
            setTimeout(() => resolve({ reference: makeReference() }), 450),
          );
        return requestWithThen("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        });
      }
      function toLesson(activity) {
        return {
          _id: activity._id,
          id: activity._id,
          topic: activity.name,
          subject: activity.category,
          location: activity.location,
          price: activity.price * 1000,
          space: Math.max(0, activity.capacity - activity.placesBooked),
          teacherFirstName: activity.teacherFirstName,
          teacherLastName: activity.teacherLastName,
          image: "/images/lesson.svg",
          description: activity.description,
          schedule: activity.schedule,
        };
      }
      function getLessons(filters = {}) {
        if (useMockData) {
          let lessons = mockActivities
            .filter((activity) => activity.isActive)
            .map(toLesson);
          const search = String(filters.search || "").toLowerCase();
          const teacher = String(filters.teacher || "").toLowerCase();
          if (search)
            lessons = lessons.filter((lesson) =>
              [lesson.topic, lesson.location, lesson.price, lesson.space]
                .join(" ")
                .toLowerCase()
                .includes(search),
            );
          if (teacher)
            lessons = lessons.filter((lesson) =>
              `${lesson.teacherFirstName} ${lesson.teacherLastName}`
                .toLowerCase()
                .includes(teacher),
            );
          const direction = filters.direction === "desc" ? -1 : 1;
          const field = ["price", "space", "location"].includes(filters.sortBy)
            ? filters.sortBy
            : "subject";
          lessons.sort(
            (a, b) =>
              String(a[field]).localeCompare(String(b[field]), undefined, {
                numeric: true,
              }) * direction,
          );
          return Promise.resolve(lessons);
        }
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        return requestWithThen(`/lessons?${params.toString()}`);
      }
      function updateLessonSpace(id, space) {
        if (useMockData) return Promise.resolve({ id, _id: id, space });
        return requestWithThen(`/lessons/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ space }),
        });
      }
      function submitOrder(order) {
        if (useMockData)
          return Promise.resolve({ reference: makeReference(), ...order });
        return requestWithThen("/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
      }

      const CobwebBackground = {
        template:
          '<canvas ref="canvas" class="cobweb-canvas" aria-hidden="true"></canvas>',
        setup(props) {
          const canvas = ref(null);
          let dispose = () => {};
          onMounted(() => {
            const element = canvas.value;
            const context = element && element.getContext("2d");
            if (!context) return;
            let width = 0,
              height = 0,
              frame = 0,
              lastTime = 0,
              resizeTimer,
              stopped = false;
            const webs = [];
            const createWeb = (x, y, radius, rings, spokes, phase) => ({
              x,
              y,
              radius,
              rings,
              spokes,
              phase,
            });
            function resize() {
              width = window.innerWidth;
              height = window.innerHeight;
              const dpr = Math.min(window.devicePixelRatio || 1, 2);
              element.width = Math.round(width * dpr);
              element.height = Math.round(height * dpr);
              element.style.width = `${width}px`;
              element.style.height = `${height}px`;
              context.setTransform(dpr, 0, 0, dpr, 0, 0);
              webs.splice(
                0,
                webs.length,
                createWeb(
                  width * 0.04,
                  height * 0.08,
                  Math.min(width, height) * 0.27,
                  5,
                  13,
                  0.5,
                ),
                createWeb(
                  width * 0.96,
                  height * 0.19,
                  Math.min(width, height) * 0.22,
                  4,
                  12,
                  1.9,
                ),
                createWeb(
                  width * 0.12,
                  height * 0.94,
                  Math.min(width, height) * 0.24,
                  4,
                  11,
                  3.2,
                ),
                createWeb(
                  width * 0.91,
                  height * 0.88,
                  Math.min(width, height) * 0.3,
                  5,
                  14,
                  4.4,
                ),
              );
            }
            function draw(time) {
              if (stopped) return;
              if (time - lastTime < 1000 / 30) {
                frame = requestAnimationFrame(draw);
                return;
              }
              lastTime = time;
              context.clearRect(0, 0, width, height);
              const dark = document.documentElement.dataset.theme === "dark";
              const color = dark ? "245, 245, 245" : "0, 107, 98";
              const motion = time * 0.00035;
              webs.forEach((web, webIndex) => {
                context.lineWidth = 0.65;
                context.lineCap = "round";
                for (let spoke = 0; spoke < web.spokes; spoke += 1) {
                  const angle = (Math.PI * 2 * spoke) / web.spokes + web.phase;
                  context.beginPath();
                  context.moveTo(web.x, web.y);
                  context.lineTo(
                    web.x + Math.cos(angle) * web.radius,
                    web.y + Math.sin(angle) * web.radius,
                  );
                  context.strokeStyle = `rgba(${color}, ${dark ? 0.12 : 0.08})`;
                  context.stroke();
                }
                for (let ring = 1; ring <= web.rings; ring += 1) {
                  const radius = (web.radius / web.rings) * ring;
                  context.beginPath();
                  for (let spoke = 0; spoke <= web.spokes; spoke += 1) {
                    const angle =
                      (Math.PI * 2 * spoke) / web.spokes + web.phase;
                    const wave =
                      Math.sin(
                        motion * 2 + ring * 0.7 + spoke * 0.8 + webIndex,
                      ) *
                      ring *
                      0.7;
                    const pointX = web.x + Math.cos(angle) * (radius + wave);
                    const pointY = web.y + Math.sin(angle) * (radius + wave);
                    if (spoke === 0) context.moveTo(pointX, pointY);
                    else context.lineTo(pointX, pointY);
                  }
                  context.strokeStyle = `rgba(${color}, ${dark ? 0.16 : 0.1})`;
                  context.stroke();
                }
              });
              frame = requestAnimationFrame(draw);
            }
            function handleResize() {
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(resize, 160);
            }
            function handleVisibility() {
              if (document.hidden) {
                cancelAnimationFrame(frame);
                frame = 0;
              } else if (!frame) {
                lastTime = 0;
                frame = requestAnimationFrame(draw);
              }
            }
            resize();
            frame = requestAnimationFrame(draw);
            window.addEventListener("resize", handleResize, { passive: true });
            document.addEventListener("visibilitychange", handleVisibility);
            dispose = () => {
              stopped = true;
              cancelAnimationFrame(frame);
              clearTimeout(resizeTimer);
              window.removeEventListener("resize", handleResize);
              document.removeEventListener(
                "visibilitychange",
                handleVisibility,
              );
            };
          });
          onUnmounted(() => dispose());
          return { canvas };
        },
      };

      const LessonCard = {
        props: {
          lesson: { type: Object, required: true },
          inCart: Boolean,
          isAdding: Boolean,
          imageIndex: { type: Number, default: 0 },
        },
        emits: ["add"],
        template:
          '<article class="lesson-card"><img class="lesson-card__image" :src="imageUrl(lesson.image, lesson.subject, imageIndex)" :alt="`${lesson.topic} lesson illustration`" loading="lazy" @error="fallbackImage($event, lesson.image, lesson.subject)" /><div class="lesson-card__body"><div class="activity-card__top"><span class="activity-card__category">{{ lesson.subject }}</span><span class="activity-card__price">${{ Number(lesson.price).toLocaleString(\'en-US\') }}</span></div><h2>{{ lesson.topic }}</h2><p>{{ lesson.description || \'A practical, friendly session led by an experienced teacher.\' }}</p><div class="activity-card__meta"><span>{{ lesson.location }}</span><span>{{ lesson.space }} spaces left</span><span>{{ lesson.teacherFirstName }} {{ lesson.teacherLastName }}</span></div><button class="button button-primary lesson-card__button" type="button" :disabled="lesson.space === 0 || inCart || isAdding" @click="$emit(\'add\', lesson)">{{ isAdding ? \'Adding...\' : inCart ? \'In cart\' : lesson.space === 0 ? \'Full\' : \'Add to cart\' }}</button></div></article>',
        setup(props) {
          const showSvg = ref(false);
          let imageTimer;
          function localImagePath(subject) {
            return (
              subjectImagePaths[String(subject || "").trim().toLowerCase()] ||
              "images/lesson.svg"
            );
          }
          function imageUrl(path, subject, index) {
            if (showSvg.value) {
              return new URL(
                localImagePath(subject),
                document.baseURI,
              ).href;
            }
            const seed = encodeURIComponent(
              `praise-${String(subject || "lesson").trim()}-${index}`,
            );
            return `https://picsum.photos/seed/${seed}/900/540`;
          }
          function fallbackImage(event, path, subject) {
            const image = event.target;
            showSvg.value = true;
            const relatedPath =
              subjectImagePaths[String(subject || "").trim().toLowerCase()];
            const fallbackPaths = [...new Set(
              [relatedPath, "images/lesson.svg", path].filter(Boolean),
            )];
            const step = Number(image.dataset.fallbackStep || 0);
            if (step >= fallbackPaths.length) {
              image.onerror = null;
              return;
            }
            image.dataset.fallbackStep = String(step + 1);
            const nextPath = fallbackPaths[step];
            image.src = nextPath.startsWith("images/")
              ? new URL(nextPath, document.baseURI).href
              : nextPath.startsWith("http")
                ? nextPath
                : `${apiBaseUrl}${nextPath}`;
          }
          onMounted(() => {
            const preload = new Image();
            preload.src = new URL(
              localImagePath(props.lesson.subject),
              document.baseURI,
            ).href;
            imageTimer = setInterval(() => {
              showSvg.value = !showSvg.value;
            }, 10000);
          });
          onUnmounted(() => clearInterval(imageTimer));
          return { imageUrl, fallbackImage };
        },
      };
      const BookingForm = {
        props: { activity: { type: Object, required: true } },
        emits: ["booked"],
        template:
          '<form class="booking-form" novalidate @submit.prevent="submitBooking"><p v-if="submitError" class="form-error" role="alert">{{ submitError }}</p><div class="form-row"><label class="field">Student’s name<input v-model="form.studentName" autocomplete="name" :aria-invalid="Boolean(errors.studentName)" /><span v-if="errors.studentName" class="field-error">{{ errors.studentName }}</span></label><label class="field">Parent / guardian name<input v-model="form.parentName" autocomplete="name" :aria-invalid="Boolean(errors.parentName)" /><span v-if="errors.parentName" class="field-error">{{ errors.parentName }}</span></label></div><div class="form-row"><label class="field">Email address<input v-model="form.contactEmail" type="email" autocomplete="email" :aria-invalid="Boolean(errors.contactEmail)" /><span v-if="errors.contactEmail" class="field-error">{{ errors.contactEmail }}</span></label><label class="field">Phone number<input v-model="form.contactPhone" type="tel" autocomplete="tel" :aria-invalid="Boolean(errors.contactPhone)" /><span v-if="errors.contactPhone" class="field-error">{{ errors.contactPhone }}</span></label></div><label class="field">Number of places<select v-model.number="form.places" :aria-invalid="Boolean(errors.places)"><option v-for="place in availablePlaces()" :key="place" :value="place">{{ place }}</option></select><span v-if="errors.places" class="field-error">{{ errors.places }}</span></label><button class="button button-primary" type="submit" :disabled="isSubmitting || availablePlaces() === 0">{{ isSubmitting ? \'Confirming booking...\' : availablePlaces() === 0 ? \'This activity is full\' : \'Confirm booking\' }}</button></form>',
        setup(props, { emit }) {
          const form = reactive({
            studentName: "",
            parentName: "",
            contactEmail: "",
            contactPhone: "",
            places: 1,
          });
          const errors = ref({});
          const submitError = ref("");
          const isSubmitting = ref(false);
          const availablePlaces = () =>
            Math.max(props.activity.capacity - props.activity.placesBooked, 0);
          function validate() {
            const nextErrors = {};
            if (form.studentName.trim().length < 2)
              nextErrors.studentName = "Enter the student’s full name.";
            if (form.parentName.trim().length < 2)
              nextErrors.parentName = "Enter the parent or guardian’s name.";
            if (!/^\S+@\S+\.\S+$/.test(form.contactEmail.trim()))
              nextErrors.contactEmail = "Enter a valid email address.";
            if (form.contactPhone.trim().length < 7)
              nextErrors.contactPhone = "Enter a valid phone number.";
            if (
              !Number.isInteger(Number(form.places)) ||
              Number(form.places) < 1 ||
              Number(form.places) > availablePlaces()
            )
              nextErrors.places = `Choose between 1 and ${availablePlaces()} places.`;
            errors.value = nextErrors;
            return Object.keys(nextErrors).length === 0;
          }
          async function submitBooking() {
            submitError.value = "";
            if (!validate()) return;
            isSubmitting.value = true;
            try {
              const result = await createBooking({
                activityId: props.activity._id,
                studentName: form.studentName.trim(),
                parentName: form.parentName.trim(),
                contactEmail: form.contactEmail.trim(),
                contactPhone: form.contactPhone.trim(),
                places: Number(form.places),
              });
              if (!result.reference)
                throw new Error(
                  "The booking service did not return a confirmation reference.",
                );
              emit("booked", result.reference);
            } catch (error) {
              submitError.value =
                error.message ||
                "Your booking could not be completed. Please try again.";
            } finally {
              isSubmitting.value = false;
            }
          }
          return {
            form,
            errors,
            submitError,
            isSubmitting,
            availablePlaces,
            submitBooking,
          };
        },
      };

      const HomeView = {
        template:
          '<section class="page-section hero"><div class="hero-copy"><h1>Small groups. Big after-school ideas.</h1><p class="lede">Praise brings practical art, technology and sport sessions to children aged 6 to 12. Find an activity that feels like them.</p><a class="button button-google" href="#/activities">Explore activities</a></div><aside class="hero-card" aria-label="Featured activity categories"><div class="hero-card-inner"><p class="eyebrow">A new favourite each week</p><strong>Discover, make, move and grow.</strong><ul><li>Creative art</li><li>Code club</li><li>Music making</li><li>Active play</li></ul></div></aside></section><section class="section-tint"><div class="page-section"><div class="section-heading"><h2>A straightforward way to find a great session.</h2></div><div class="activity-grid how-it-works-grid"><article class="activity-card"><h3>Choose an activity</h3><p>Browse clear activity details, including the suitable age range, time and price.</p></article><article class="activity-card"><h3>Reserve a place</h3><p>Enter the student and parent or guardian details using the secure booking form.</p></article><article class="activity-card"><h3>Get confirmation</h3><p>Receive a reference only once the booking service has confirmed the reservation.</p></article></div></div></section>',
      };
      const ActivitiesView = {
        components: { LessonCard },
        props: { cart: { type: Array, default: () => [] } },
        emits: ["cart-updated"],
        template:
          '<section class="page-section"><p class="eyebrow">Find a session</p><h1>Lessons for active, creative afternoons.</h1><p class="lede">Choose from practical sessions with clear prices, locations, teachers and spaces left.</p><form class="lesson-toolbar" @submit.prevent="loadLessons(true)"><label class="field">Search<input v-model="search" type="search" placeholder="Topic, location, price or spaces" /></label><label class="field">Teacher<input v-model="teacher" type="search" placeholder="First or last name" /></label><label class="field">Sort by<select v-model="sortBy"><option value="subject">Subject</option><option value="location">Location</option><option value="price">Price</option><option value="space">Spaces</option></select></label><label class="field">Order<select v-model="direction"><option value="asc">Ascending</option><option value="desc">Descending</option></select></label><button class="button button-primary" type="submit" :disabled="isLoading">{{ isLoading ? \'Applying...\' : \'Apply filters\' }}</button></form><p v-if="hasAppliedFilters && filterMessage" class="filter-feedback" :class="`filter-feedback--${filterMessageType}`" role="status">{{ filterMessage }}</p><div v-if="isLoading" class="state" role="status"><div><div class="loading-indicator" aria-hidden="true"></div><p>Loading lessons...</p></div></div><div v-else-if="errorMessage" class="state state-error" role="alert"><div><h2>We could not load the lessons.</h2><p>{{ errorMessage }}</p><button class="button button-primary" type="button" @click="loadLessons">Try again</button></div></div><div v-else-if="lessons.length === 0" class="state"><div><h2>No lessons match those filters.</h2><p>Try a different search or teacher name.</p></div></div><div v-else class="lesson-grid"><LessonCard v-for="(lesson, index) in lessons" :key="lesson.id || lesson._id" :lesson="lesson" :image-index="index" :in-cart="inCart(lesson)" :is-adding="addingId === (lesson.id || lesson._id)" @add="addToCart" /></div></section>',
        setup(props, { emit }) {
          const lessons = ref([]),
            isLoading = ref(true),
            errorMessage = ref(""),
            search = ref(""),
            teacher = ref(""),
            sortBy = ref("subject"),
            direction = ref("asc"),
            filterMessage = ref(""),
            filterMessageType = ref("success"),
            hasAppliedFilters = ref(false),
            addingId = ref("");
          async function loadLessons(showFeedback = false) {
            isLoading.value = true;
            errorMessage.value = "";
            if (showFeedback) {
              hasAppliedFilters.value = true;
              filterMessage.value = "";
            }
            try {
              lessons.value = await getLessons({
                search: search.value,
                teacher: teacher.value,
                sortBy: sortBy.value,
                direction: direction.value,
              });
              if (showFeedback) {
                filterMessageType.value = lessons.value.length
                  ? "success"
                  : "empty";
                filterMessage.value = lessons.value.length
                  ? `${lessons.value.length} lesson${lessons.value.length === 1 ? "" : "s"} found. Your filters were applied.`
                  : "No lessons match those filters. Try a different search or teacher name.";
              }
            } catch (error) {
              errorMessage.value =
                error.message || "Lessons could not be loaded.";
              if (showFeedback) {
                filterMessageType.value = "error";
                filterMessage.value =
                  "The filters could not be applied. Please try again.";
              }
            } finally {
              isLoading.value = false;
            }
          }
          async function addToCart(lesson) {
            errorMessage.value = "";
            if (Number(lesson.space) < 1 || inCart(lesson)) return;
            addingId.value = lesson.id || lesson._id;
            emit("cart-updated", [...props.cart, lesson]);
            addingId.value = "";
          }
          const inCart = (lesson) =>
            props.cart.some(
              (item) => (item.id || item._id) === (lesson.id || lesson._id),
            );
          onMounted(loadLessons);
          return {
            lessons,
            isLoading,
            errorMessage,
            search,
            teacher,
            sortBy,
            direction,
            filterMessage,
            filterMessageType,
            hasAppliedFilters,
            addingId,
            loadLessons,
            addToCart,
            inCart,
          };
        },
      };
      const ActivityDetailsView = {
        components: { BookingForm },
        props: { activityId: { type: String, required: true } },
        template:
          '<section class="page-section"><div v-if="isLoading" class="state" role="status"><div><div class="loading-indicator" aria-hidden="true"></div><p>Loading activity details...</p></div></div><div v-else-if="errorMessage" class="state state-error" role="alert"><div><h1>We could not find that activity.</h1><p>{{ errorMessage }}</p><div class="retry-row"><button class="button button-primary" type="button" @click="loadActivity">Try again</button><a class="button button-secondary" href="#/activities">View all activities</a></div></div></div><div v-else-if="activity" class="detail-layout"><div><h1>{{ activity.name }}</h1><p class="detail-description">{{ activity.description }}</p><ul class="detail-list" aria-label="Activity information"><li><strong>Age range</strong> {{ activity.minAge }}-{{ activity.maxAge }} years</li><li><strong>Schedule</strong> {{ activity.schedule }}</li><li><strong>Price</strong> ${{ Number(activity.price).toLocaleString(\'en-US\') }} per session</li><li><strong>Availability</strong> {{ Math.max(activity.capacity - activity.placesBooked, 0) }} places left</li></ul></div><aside class="booking-panel"><h2>Reserve a place</h2><p>Complete the details below. Your booking is only confirmed after the service responds with a reference.</p><BookingForm :activity="activity" @booked="handleBooked" /></aside></div></section>',
        setup(props) {
          const activity = ref(null),
            isLoading = ref(true),
            errorMessage = ref("");
          async function loadActivity() {
            isLoading.value = true;
            errorMessage.value = "";
            try {
              activity.value = await getActivity(props.activityId);
            } catch (error) {
              errorMessage.value =
                error.message || "This activity could not be loaded.";
            } finally {
              isLoading.value = false;
            }
          }
          function handleBooked(reference) {
            sessionStorage.setItem("praise-last-booking", reference);
            window.location.hash = `#/booking-confirmation/${encodeURIComponent(reference)}`;
          }
          onMounted(loadActivity);
          return {
            activity,
            isLoading,
            errorMessage,
            loadActivity,
            handleBooked,
          };
        },
      };
      const CartView = {
        props: { cart: { type: Array, default: () => [] } },
        emits: ["cart-updated"],
        template:
          '<section class="page-section cart-page"><p class="eyebrow">Your lessons</p><h1>Cart and checkout</h1><div v-if="submitted" class="state confirmation" role="status"><div><div class="confirmation-mark" aria-hidden="true">✓</div><h2>Order submitted</h2><p>Your lessons are reserved. We will contact you with the next steps.</p><a class="button button-primary" href="#/activities">Choose more lessons</a></div></div><div v-else-if="cart.length === 0" class="state"><div><h2>Your cart is empty.</h2><p>Add a lesson before checking out.</p><a class="button button-primary" href="#/activities">Browse lessons</a></div></div><div v-else class="cart-layout"><div class="cart-list"><article v-for="lesson in cart" :key="lesson.id || lesson._id" class="cart-item"><div><p class="activity-card__category">{{ lesson.subject }}</p><h2>{{ lesson.topic }}</h2><p>{{ lesson.location }} · ${{ Number(lesson.price).toLocaleString(\'en-US\') }}</p></div><button class="button button-secondary" type="button" @click="removeLesson(lesson)">Remove</button></article></div><form class="booking-panel booking-form" :aria-busy="isSubmitting" @submit.prevent="checkout"><h2>Parent details</h2><label class="field">Name<input v-model="name" type="text" autocomplete="name" required pattern="[a-zA-Z\\s]+" /><span v-if="name && !nameValid" class="field-error">Use letters and spaces only.</span></label><label class="field">Phone<input v-model="phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9]+" /><span v-if="phone && !phoneValid" class="field-error">Use numbers only.</span></label><p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p><button class="button button-primary" type="submit" :disabled="!canSubmit"><span v-if="isSubmitting" class="button-spinner" aria-hidden="true"></span>{{ isSubmitting ? \'Submitting...\' : \'Submit order\' }}</button></form></div><div v-if="showSuccessModal" class="modal-backdrop" role="presentation" @click.self="showSuccessModal = false"><section class="success-modal" role="dialog" aria-modal="true"><button class="modal-close" type="button" aria-label="Close order confirmation" @click="showSuccessModal = false">×</button><div class="confirmation-mark" aria-hidden="true">✓</div><p class="eyebrow">Order complete</p><h2>Order submitted</h2><p>Your lessons are reserved and your order has been saved.</p><a class="button button-primary" href="#/activities" @click="showSuccessModal = false">Continue browsing</a></section></div></section>',
        setup(props, { emit }) {
          const name = ref(""),
            phone = ref(""),
            isSubmitting = ref(false),
            errorMessage = ref(""),
            submitted = ref(false),
            showSuccessModal = ref(false);
          const nameValid = computed(() =>
              /^[a-zA-Z\s]+$/.test(name.value.trim()),
            ),
            phoneValid = computed(() => /^[0-9]+$/.test(phone.value)),
            canSubmit = computed(
              () =>
                props.cart.length > 0 &&
                nameValid.value &&
                phoneValid.value &&
                !isSubmitting.value,
            );
          function removeLesson(lesson) {
            errorMessage.value = "";
            emit(
              "cart-updated",
              props.cart.filter(
                (item) => (item.id || item._id) !== (lesson.id || lesson._id),
              ),
            );
          }
          async function checkout() {
            if (!canSubmit.value) return;
            isSubmitting.value = true;
            errorMessage.value = "";
            try {
              await submitOrder({
                name: name.value.trim(),
                phone: phone.value,
                lessonIDs: props.cart.map((lesson) => lesson.id || lesson._id),
                numberOfSpaces: props.cart.length,
              });
              emit("cart-updated", []);
              submitted.value = true;
              showSuccessModal.value = true;
            } catch (error) {
              errorMessage.value = error.message;
            } finally {
              isSubmitting.value = false;
            }
          }
          return {
            name,
            phone,
            isSubmitting,
            errorMessage,
            submitted,
            showSuccessModal,
            nameValid,
            phoneValid,
            canSubmit,
            removeLesson,
            checkout,
          };
        },
      };
      const BookingConfirmationView = {
        props: { reference: { type: String, required: true } },
        template:
          '<section class="page-section confirmation"><template v-if="isConfirmed"><div class="confirmation-mark" aria-hidden="true">✓</div><p class="eyebrow">Booking confirmed</p><h1>Your place has been reserved.</h1><p class="lede">Keep this booking reference for your records. We will use the contact details you provided for any updates.</p><p class="reference" aria-label="Booking reference">{{ reference }}</p><p><a class="button button-primary" href="#/activities">Browse more activities</a></p></template><template v-else><p class="eyebrow">Confirmation unavailable</p><h1>We cannot verify that booking reference.</h1><p class="lede">For privacy, confirmation details appear only immediately after a successful booking.</p><a class="button button-primary" href="#/activities">Browse activities</a></template></section>',
        setup(props) {
          return {
            isConfirmed: computed(
              () =>
                sessionStorage.getItem("praise-last-booking") ===
                props.reference,
            ),
          };
        },
      };
      const App = {
        components: {
          CobwebBackground,
          HomeView,
          ActivitiesView,
          ActivityDetailsView,
          BookingConfirmationView,
          CartView,
        },
        template:
          '<CobwebBackground /><a class="skip-link" href="#main-content">Skip to main content</a><header class="site-header"><a class="brand" href="#/" aria-label="Praise home">Praise</a><nav aria-label="Main navigation"><a href="#/" :aria-current="currentView.key === \'home\' ? \'page\' : undefined">Home</a><a href="#/activities" :aria-current="currentView.key === \'activities\' ? \'page\' : undefined">Activities</a><a class="cart-link" href="#/cart" :aria-current="currentView.key === \'cart\' ? \'page\' : undefined" :aria-disabled="cart.length === 0" @click="goToCart">Cart<span v-if="cart.length"> ({{ cart.length }})</span></a><button class="theme-toggle" type="button" :aria-label="theme === \'light\' ? \'Switch to dark mode\' : \'Switch to light mode\'" :aria-pressed="theme === \'dark\'" @click="toggleTheme"><span aria-hidden="true">{{ theme === \'light\' ? \'☾\' : \'☀\' }}</span><span class="theme-toggle__label">{{ theme === \'light\' ? \'Dark\' : \'Light\' }}</span></button></nav></header><main id="main-content"><section v-if="currentView.notFound" class="not-found page-section"><p class="eyebrow">Page not found</p><h1>That page has moved or does not exist.</h1><a class="button button-primary" href="#/activities">Browse activities</a></section><component v-else :is="currentView.component" :key="route" :activity-id="currentView.activityId" :reference="currentView.reference" :cart="cart" @cart-updated="updateCart" /></main><footer class="site-footer"><p>Activities</p><p>© {{ new Date().getFullYear() }} Activities</p></footer>',
        setup() {
          const route = ref(window.location.hash || window.PRAISE_INITIAL_ROUTE || "#/"),
            theme = ref("light"),
            cart = ref([]);
          const currentView = computed(() => {
            const path = route.value.slice(1) || "/";
            if (path === "/") return { component: "HomeView", key: "home" };
            if (path === "/activities")
              return { component: "ActivitiesView", key: "activities" };
            if (path === "/cart") return { component: "CartView", key: "cart" };
            if (path.startsWith("/activities/"))
              return {
                component: "ActivityDetailsView",
                key: "details",
                activityId: decodeURIComponent(
                  path.replace("/activities/", ""),
                ),
              };
            if (path.startsWith("/booking-confirmation/"))
              return {
                component: "BookingConfirmationView",
                key: "confirmation",
                reference: decodeURIComponent(
                  path.replace("/booking-confirmation/", ""),
                ),
              };
            return { component: "HomeView", key: "not-found", notFound: true };
          });
          function updateRoute() {
            route.value = window.location.hash || "#/";
          }
          function setTheme(nextTheme) {
            theme.value = nextTheme;
            document.documentElement.dataset.theme = nextTheme;
            localStorage.setItem("praise-theme", nextTheme);
          }
          function toggleTheme() {
            setTheme(theme.value === "light" ? "dark" : "light");
          }
          function updateCart(nextCart) {
            cart.value = nextCart;
          }
          function goToCart(event) {
            if (cart.value.length === 0) event.preventDefault();
          }
          onMounted(() => {
            const savedTheme = localStorage.getItem("praise-theme");
            const systemTheme = window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches
              ? "dark"
              : "light";
            setTheme(
              savedTheme === "dark" || savedTheme === "light"
                ? savedTheme
                : systemTheme,
            );
            window.addEventListener("hashchange", updateRoute);
          });
          onUnmounted(() =>
            window.removeEventListener("hashchange", updateRoute),
          );
          return {
            route,
            theme,
            cart,
            currentView,
            toggleTheme,
            updateCart,
            goToCart,
          };
        },
      };
      createApp(App).mount("#app");
