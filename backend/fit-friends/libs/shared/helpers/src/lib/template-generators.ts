import { TrainerInfo, TrainingCard } from '@libs/shared/app-types';

export function createTrainingCard({
  price,
  backgroundImage,
  title,
  trainingType,
  caloriesToBurn,
  description,
}: TrainingCard) {
  return `<div class="card_container">
            <div class="price_container">
              <p class="price">${price} ₽</p>
            </div>
            <img class="card_image" src=${backgroundImage} />
            <div class="card_title">${title}</div>
            <div class="training_tags_container">
              <div class="card_tag">
                <div>#${trainingType}</div>
              </div>
              <div class="card_tag" style="margin-left: 8px;">
                <div>#${caloriesToBurn}ккал</div>
              </div>
            </div>
            <div class="card_description">
              <p class="text">${description}</p>
            </div>
            <div class="buttons-container">
              <div class="card_button" style="background: #C5EC2A">
                <div>Подробнее</div>
              </div>
              <div class="card_button" style="border: 1px #CFCFCF solid">
                <div>Отзывы</div>
              </div>
            </div>
          </div>`;
}

export function createCardDeck(trainings: TrainingCard[]) {
  return `<div class="cards_deck">
          ${trainings.map((training) => createTrainingCard(training)).join('')}
         </div>`;
}

export function createTrainerBlock(
  { name, avatarUrl, location }: TrainerInfo,
  trainings: TrainingCard[],
) {
  return `<section class="trainer_block">
            <div class="trainer_info_container">
              <div class="avatar">
                <img src="${avatarUrl}">
              </div>
            
              <div class="author_block">
                <div class="author_name">${name}</div>
                <div class="author_location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                      <path d="M7.00001 8.62182C8.19902 8.62182 9.17101 7.69035 9.17101 6.54132C9.17101 5.39229 8.19902 4.46083 7.00001 4.46083C5.801 4.46083 4.82901 5.39229 4.82901 6.54132C4.82901 7.69035 5.801 8.62182 7.00001 8.62182Z" stroke="#ADADAD"></path>
                      <path d="M1.16892 5.3277C2.53971 -0.447009 11.4673 -0.440341 12.8311 5.33437C13.6313 8.72184 11.4325 12.256 9.50502 14.0298C8.10639 15.3234 5.89363 15.3234 4.48805 14.0298C2.56755 12.256 0.368708 8.71517 1.16892 5.3277Z" stroke="#ADADAD"></path>
                    </svg>
                  <div class="location_name">${location}</div>
                </div>
              </div>
            </div>
            ${createCardDeck(trainings)}   
          </section>`;
}
