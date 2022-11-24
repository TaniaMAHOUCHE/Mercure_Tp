<?php

namespace App\Factory;

use App\Entity\Chat;
use App\Repository\ChatRepository;
use Zenstruck\Foundry\RepositoryProxy;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use App\Service\TopicHelper;

/**
 * @extends ModelFactory<Chat>
 *
 * @method static Chat|Proxy createOne(array $attributes = [])
 * @method static Chat[]|Proxy[] createMany(int $number, array|callable $attributes = [])
 * @method static Chat[]|Proxy[] createSequence(array|callable $sequence)
 * @method static Chat|Proxy find(object|array|mixed $criteria)
 * @method static Chat|Proxy findOrCreate(array $attributes)
 * @method static Chat|Proxy first(string $sortedField = 'id')
 * @method static Chat|Proxy last(string $sortedField = 'id')
 * @method static Chat|Proxy random(array $attributes = [])
 * @method static Chat|Proxy randomOrCreate(array $attributes = [])
 * @method static Chat[]|Proxy[] all()
 * @method static Chat[]|Proxy[] findBy(array $attributes)
 * @method static Chat[]|Proxy[] randomSet(int $number, array $attributes = [])
 * @method static Chat[]|Proxy[] randomRange(int $min, int $max, array $attributes = [])
 * @method static ChatRepository|RepositoryProxy repository()
 * @method Chat|Proxy create(array|callable $attributes = [])
 */
final class ChatFactory extends ModelFactory
{
    private TopicHelper $topicHelper;

    public function __construct(TopicHelper $topicHelper)
    {
        parent::__construct();
        $this->topicHelper = $topicHelper;
    }

    protected function getDefaults(): array
    {
        return [
            'topic' => $this->topicHelper->getPrivateChatTopic(UserFactory::random()->getId(), UserFactory::random()->getId()),
        ];
    }

    protected function initialize(): self
    {
        // see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
        return $this
            // ->afterInstantiate(function(Chat $chat): void {})
        ;
    }

    protected static function getClass(): string
    {
        return Chat::class;
    }
}
