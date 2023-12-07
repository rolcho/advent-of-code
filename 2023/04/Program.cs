using System.Globalization;
using System.Text;

public class Card
{
    public int Id { get; set; }
    public int[] WinNumbers { get; set; }
    public int[] MyNumbers { get; set; }
    public int Multiply { get; set; } = 1;
    public bool IsWinner { get; set; } = false;

    public Card()
    {
        Id = 0;
        WinNumbers = [];
        MyNumbers = [];
    }

    public Card(int id, int[] winNumbers, int[] myNumbers)
    {
        Id = id;
        WinNumbers = winNumbers;
        MyNumbers = myNumbers;
        IsWinner = WinNumbers.Intersect(MyNumbers).ToArray().Length > 0;
    }

    public int GetCardPoints(){
        int sumPoints = 0;

        var winnerNumbers = WinNumbers.Intersect(MyNumbers).ToArray().Length;
            if (winnerNumbers > 0)
            {
                sumPoints += (int)Math.Pow(2, winnerNumbers -1);
            }

        return sumPoints;
    }
}

public class Program
{
    public static void Main()
    {
        var cards = new StringBuilder();
        cards.AppendLine(@"Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53");
        cards.AppendLine(@"Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19");
        cards.AppendLine(@"Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1");
        cards.AppendLine(@"Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83");
        cards.AppendLine(@"Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36");
        cards.AppendLine(@"Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11");

        string cardsString = cards.ToString();

        string[] cardsArray = cardsString.Split(Environment.NewLine);
        string[] fileArray = File.ReadAllLines(@"./input.txt");

        List<Card> cardObjects = CreateCards(cardsArray);
        cardObjects = CardIncrement(cardObjects);
        Console.WriteLine(GetCardCount(cardObjects));
    }

    public static List<Card> CreateCards(string[] cardArray) 
    {
        var cardObjects = new List<Card>();

        for (int i = 0; i < cardArray.Length; i++)
        {
            string card = cardArray[i];
            string[] cardContent = card.Replace("Card ", "").Split(":");

            if (cardContent.Length != 2)
            {
                continue;
            }
            
            int cardId = int.Parse(cardContent[0].Trim());

            string[] cardNumbers = cardContent[1].Split("|");

            if (cardNumbers.Length != 2)
            {
                continue;
            }

            int[] winNumbers = cardNumbers[0].Replace("  ", " ").Trim().Split(" ").Select(int.Parse).ToArray();
            int[] myNumbers = cardNumbers[1].Replace("  ", " ").Trim().Split(" ").Select(int.Parse).ToArray();

            cardObjects.Add(new Card(cardId, winNumbers, myNumbers));

        }

        return cardObjects;

    }

    public static int SumCards(List<Card> cards) 
    {
        int sum = 0;

        foreach (Card card in cards) {
            sum += card.GetCardPoints();
        }

        return sum;
    }

    public static List<Card> CardIncrement(List<Card> cardsObjects)
    {
        var cards = cardsObjects;
        int cardCount = cards.Count;

        for (int i = 0; i < cardCount; i++)
        {
            if (cards[i].IsWinner)
            {
                for (int j = 0; j < cards[i].GetCardPoints(); j++)
                {
                    try {
                        Card currentCard = cards[i+j+1];
                        currentCard.Multiply += 1;
                    }
                    catch {
                        continue;
                    }
                }
            }
        }

        return cards;

    }

    public static int GetCardCount(List<Card> cards) 
    {
        int cardCounter = 0;

        for (int i = 0; i < cards.Count; i++)
        {
            // cardCounter += cards[i].Multiply;
            Console.WriteLine($"Id: {cards[i].Id} Count: {cards[i].Multiply}");
        }

        return cardCounter;
    }
}
